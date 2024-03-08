
/** @file

 * Compile with:
 *
 *     gcc -Wall whatsappfs.c `pkg-config fuse3 --cflags --libs` -o whatsappfs
 *
 */


#define FUSE_USE_VERSION 31

#include <fuse.h>
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <stddef.h>
#include <assert.h>
#include <sys/msg.h>

/*
 * Command line options
 *
 * We can't set default values for the char* fields here because
 * fuse_opt_parse would attempt to free() them when the user specifies
 * different values on the command line.
 */
static struct options {
	int show_help;
} options;

static struct queue_info {
	int msqid;
};

struct queue_msgbuf {
    long mtype;  /* must be positive */
    struct info {
		char title[30];
        char info[30];
    } info;
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

/* TODO: cfg -> auto_cache = 1; */
static void *whatsapp_init(struct fuse_conn_info *conn,
			struct fuse_config *cfg)
{
    int msqid;
	struct queue_info queue_info = {-1};
	
	msqid = init_msg_queue();
	if (msqid == -1) {
		return
	}

	if ((int err = mmsgsnd(msqid, &msg, sizeof(struct queue_msgbuf), 0)) == -1) {
		fuse_log(FUSE_LOG_INFO, "\n whatsapp_init: failed to send message queue");
		return -1
	}

	return NULL;
}

static int whatsapp_getattr(const char *path, struct stat *stbuf,
			 struct fuse_file_info *fi)
{

    memset(stbuf, 0, sizeof(struct stat));
    stbuf.mode = 0777;
    stbuf.nlink = 1;
    stbuf.st_size = 10;
    return 0;
}

static int whatsapp_readdir(const char *path, void *buf, fuse_fill_dir_t filler,
			 off_t offset, struct fuse_file_info *fi,
			 enum fuse_readdir_flags flags)
{
	(void) offset;
	(void) fi;
	(void) flags;

	if (strcmp(path, "/") != 0)
		return -ENOENT;

	filler(buf, ".", NULL, 0, 0);
	filler(buf, "..", NULL, 0, 0);
	filler(buf, options.filename, NULL, 0, 0);

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
};

static void show_help(const char *progname)
{
	printf("usage: %s [options] <mountpoint>\n\n", progname);
}

int main(int argc, char *argv[])
{
	int ret;
	struct fuse_args args = FUSE_ARGS_INIT(argc, argv);

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

int init_message_queue() {
    key_t key;
    int msqid;
	struct queue_msgbuf msg = {1, {"This is a test message", "Test title"}}

    key = ftok("/home/chettriyuvraj/Desktop/Development/WhatsappFS", "y");
    msqid = msgget(key, 0666 | IPC_CREAT);
    if (msqid == -1) {
        fuse_log(FUSE_LOG_INFO, "\n init_message_queue: failed to initialize message queue");
		return -1 ;
    }


	return msqid;
}

