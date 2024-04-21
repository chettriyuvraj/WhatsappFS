
/** @file

 * Compile with:
 *
 *     gcc -Wall fs.c `pkg-config fuse3 --cflags --libs` -o whatsappfs
 *
 */


#define FUSE_USE_VERSION 31
#define MSG_QUEUE_KEY 310898
#define MSG_SEND_TYPE 1

#include <fuse.h>
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <stddef.h>
#include <assert.h>
#include <sys/msg.h>

#include "vendor/frozen.h"
#include "vendor/frozen.c"

#define MAX_MESSAGE_SIZE (size_t)1024

/*
 * Command line options
 *
 * We can't set default values for the char* fields here because
 * fuse_opt_parse would attempt to free() them when the user specifies
 * different values on the command line.
 */
static struct options {
	const char *filename;
	const char *contents;
	int show_help;
} options;

static struct queue_info {
	int msqid;
};

struct queue_msgbuf {
    long mtype;  /* must be positive */
	struct info {
		uint32_t size;
		char data[MAX_MESSAGE_SIZE];
	} msg_info;
};

#define OPTION(t, p)                           \
    { t, offsetof(struct options, p), 1 }
static const struct fuse_opt option_spec[] = {
	OPTION("--name=%s", filename),
	OPTION("--contents=%s", contents),
	OPTION("-h", show_help),
	OPTION("--help", show_help),
	FUSE_OPT_END
};

int init_msg_queue();
int exchange_json(const char *action, const char *path);

struct queue_info queue_info = {-1};

/* TODO: cfg -> auto_cache = 1; */
static void *whatsapp_init(struct fuse_conn_info *conn,
			struct fuse_config *cfg)
{	
	/* Initialize message queue */
	int msqid = init_msg_queue();
	if (msqid == -1) {
		return;
	}
	queue_info.msqid = msqid;

	fuse_log(FUSE_LOG_INFO, "\n whatsapp_init: Successfully init message queue");
}

static int whatsapp_getattr(const char *path, struct stat *stbuf,
			 struct fuse_file_info *fi)
{
	if (exchange_json("getattr", path) == -1) {
		fuse_log(FUSE_LOG_INFO, "\n whatsapp_getattr: failed to exchange json");
	}
	return 0;
}

static int whatsapp_readdir(const char *path, void *buf, fuse_fill_dir_t filler,
			 off_t offset, struct fuse_file_info *fi,
			 enum fuse_readdir_flags flags)
{
	/* Fill up routes for the base path */
	if (strcmp(path, "/") == 0)
	{
		filler(buf, ".", NULL, 0, 0);
		filler(buf, "..", NULL, 0, 0);
		filler(buf, "chats", NULL, 0, 0);
		return 0;
	}




	if (exchange_json("readdir", path) == -1) {
		fuse_log(FUSE_LOG_INFO, "\n whatsapp_readdir: failed to exchange json");
	}
	return 0;
}

static int whatsapp_open(const char *path, struct fuse_file_info *fi)
{
	if (strcmp(path+1, options.filename) != 0)
		return -ENOENT;

	if ((fi->flags & O_ACCMODE) != O_RDONLY)
		return -EACCES;

	return 0;
}

static int whatsapp_read(const char *path, char *buf, size_t size, off_t offset,
		      struct fuse_file_info *fi)
{
	size_t len;
	(void) fi;
	if(strcmp(path+1, options.filename) != 0)
		return -ENOENT;

	len = strlen(options.contents);
	if (offset < len) {
		if (offset + size > len)
			size = len - offset;
		memcpy(buf, options.contents + offset, size);
	} else
		size = 0;

	return size;
}

static const struct fuse_operations whatsapp_oper = {
	.init           = whatsapp_init,
	.getattr	= whatsapp_getattr,
	.readdir	= whatsapp_readdir,
	.open		= whatsapp_open,
	.read		= whatsapp_read,
};

static void show_help(const char *progname)
{
	printf("usage: %s [options] <mountpoint>\n\n", progname);
}

int main(int argc, char *argv[]) {
	int ret;
	struct fuse_args args = FUSE_ARGS_INIT(argc, argv);

	options.filename = strdup("hello");
	options.contents = strdup("Hello World!\n");

	/* Parse options */
	if (fuse_opt_parse(&args, &options, option_spec, NULL) == -1)
		return 1;

	/* When --help is specified, first print our own file-system
	   specific help text, then signal fuse_main to show
	   additional help (by adding `--help` to the options again)
	   without usage: line (by setting argv[0] to the empty
	   string) TODO: check later */
	if (options.show_help) {
		show_help(argv[0]);
		assert(fuse_opt_add_arg(&args, "--help") == 0);
		args.argv[0][0] = '\0';
	}

	ret = fuse_main(args.argc, args.argv, &whatsapp_oper, NULL);
	fuse_opt_free_args(&args);
	return ret;
}


/*** HELPERS ***/

int exchange_json(const char *action, const char *path) {
	/* Initialize message struct and get JSON */
	struct queue_msgbuf msg;
	char *jsonbuf = malloc(MAX_MESSAGE_SIZE);
	struct json_out out = JSON_OUT_BUF(jsonbuf, MAX_MESSAGE_SIZE);
	if (json_printf(&out, "{action: %Q, path: %Q}", action, path) == -1 ) { /* Check if -1 is valid error code for this later */ 
		fuse_log(FUSE_LOG_INFO, "\n exchange_json: failed to convert action and path to json");
		return -1;
	}

	/* Fill message struct */
	msg.mtype = MSG_SEND_TYPE;
	msg.msg_info.size = strlen(jsonbuf);
	strcpy(msg.msg_info.data, jsonbuf);
	printf("\nData: %s\n", msg.msg_info.data);

	/* Send to message queue */
	if (msgsnd(queue_info.msqid, &msg, sizeof(struct queue_msgbuf), 0) == -1) {
		fuse_log(FUSE_LOG_INFO, "\n exchange_json: failed to send to message queue");
		return -1;
	}
	fuse_log(FUSE_LOG_INFO, "\n exchange_json: successfully converted action and path to json");
	return 0;
}

int init_msg_queue() {
    key_t key;
    int msqid;

	key = MSG_QUEUE_KEY;
    msqid = msgget(key, 0666 | IPC_CREAT);
    if (msqid == -1) {
        fuse_log(FUSE_LOG_INFO, "\n init_msg_queue: failed to initialize message queue");
		return -1 ;
    }


	return msqid;
}

