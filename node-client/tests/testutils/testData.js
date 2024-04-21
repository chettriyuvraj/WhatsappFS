/* 
	Mock chats
	- id.user => number
*/
const chats = [
	{
			id: {
					user: "1234567890"
			},
			name: 'Arnold',
			isGroup: false,
			isMuted: false,
			timestamp: 1500000000000, 
			lastMessage: 'Hey girl!',
	},
	{
			id: {
					user: "2345678901"
			},
			name: 'Family group',
			isGroup: true,
			isMuted: true,
			timestamp: 1550000000000, 
			lastMessage: 'I will be there soon!',
	},
	{
			id: {
					user: "3456789012"
			},
			name: 'Bob',
			isGroup: false,
			isMuted: true,
			timestamp: 1600000000000, 
			lastMessage: 'How are you?',
	},
	{
			id: {
					user: "4567890123"
			},
			name: 'Charlie',
			isGroup: false,
			isMuted: false,
			timestamp: 1650000000000, 
			lastMessage: 'See you tomorrow!',
	},
	{
			id: {
					user: "5678901234"
			},
			name: 'Friends group',
			isGroup: true,
			isMuted: false,
			timestamp: 1700000000000, 
			lastMessage: 'Let\'s plan the trip.',
	},
	{
			id: {
					user: "6789012345"
			},
			name: 'Emma',
			isGroup: false,
			isMuted: true,
			timestamp: 1750000000000, 
			lastMessage: 'Can you call me?',
	},
	{
			id: {
					user: "7890123456"
			},
			name: 'Frank',
			isGroup: false,
			isMuted: false,
			timestamp: 1800000000000, 
			lastMessage: 'Thanks for the gift!',
	},
	{
			id: {
					user: "8901234567"
			},
			name: 'College group',
			isGroup: true,
			isMuted: false,
			timestamp: 1850000000000, 
			lastMessage: 'What\'s the plan for tonight?',
	},
	{
			id: {
					user: "9012345678"
			},
			name: 'Hannah',
			isGroup: false,
			isMuted: true,
			timestamp: 1900000000000, 
			lastMessage: 'See you at the party!',
	},
	{
			id: {
					user: "0123456789"
			},
			name: 'Ian',
			isGroup: false,
			isMuted: false,
			timestamp: 1950000000000, 
			lastMessage: 'Good morning!',
	}
];

/* 
	Mock contacts
	- id.user => number
*/

const contacts = [
	{
			number: '9233494994',
			isUser: true,
			isBusiness: false,
			isBlocked: false,
			isEnterprise: false,
			name: 'Richard',
	},
	{
			number: '6789034567',
			isUser: true,
			isBusiness: false,
			isBlocked: true,
			isEnterprise: false,
			name: 'Alice',
	},
	{
			number: '1234567890',
			isUser: true,
			isBusiness: false,
			isBlocked: false,
			isEnterprise: false,
			name: 'Bob',
	},
	{
			number: '4567890123',
			isUser: false,
			isBusiness: true,
			isBlocked: false,
			isEnterprise: false,
			name: 'XYZ Corp',
	},
	{
			number: '9876543210',
			isUser: true,
			isBusiness: false,
			isBlocked: false,
			isEnterprise: false,
			name: 'Emily',
	},
	{
			number: '2345678901',
			isUser: true,
			isBusiness: false,
			isBlocked: false,
			isEnterprise: false,
			name: 'John',
	},
	{
			number: '8901234567',
			isUser: true,
			isBusiness: false,
			isBlocked: false,
			isEnterprise: true,
			name: 'Acme Corp',
	},
	{
			number: '3456789012',
			isUser: true,
			isBusiness: false,
			isBlocked: true,
			isEnterprise: false,
			name: 'Sarah',
	},
	{
			number: '5678901234',
			isUser: true,
			isBusiness: false,
			isBlocked: false,
			isEnterprise: false,
			name: 'David',
	},
	{
			number: '0123456789',
			isUser: true,
			isBusiness: false,
			isBlocked: false,
			isEnterprise: false,
			name: 'Sophia',
	}
];

const qr = 'this is a test qr';

module.exports = {
    chats,
    contacts,
	qr
}