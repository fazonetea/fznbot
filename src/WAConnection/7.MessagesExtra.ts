Skip to content
Search or jump to…

Pull requests
Issues
Marketplace
Explore
 
@fazonetea 
fazonetea
/
fznbot
1
00
Code
Issues
Pull requests
Actions
Projects
Wiki
Security
2
Insights
Settings
fznbot
/
src
/
WAConnection
/
7.MessagesExtra.ts
in
master
 

Spaces

4

No wrap
1
import {WAConnection as Base} from './6.MessagesSend'
2
import { MessageType, WAMessageKey, MessageInfo, WAMessageContent, WAMetric, WAFlag, WANode, WAMessage, WAMessageProto, ChatModification, FAZONEError, WAChatIndex, WAChat } from './Constants'
3
import { whatsappID, delay, toNumber, unixTimestampSeconds, GET_MESSAGE_ID, isGroupID, newMessagesDB } from './Utils'
4
import { Mutex } from './Mutex'
5
​
6
export class WAConnection extends Base {
7
    
8
    @Mutex ()
9
    async loadAllUnreadMessages () {
10
        const tasks = this.chats.all()
11
                    .filter(chat => chat.count > 0)
12
                    .map (chat => this.loadMessages(chat.jid, chat.count))
13
        const list = await Promise.all (tasks)
14
        const combined: WAMessage[] = []
15
        list.forEach (({messages}) => combined.push(...messages))
16
        return combined
17
    }
18
    /** Get the message info, who has read it, who its been delivered to */
19
    @Mutex ((jid, messageID) => jid+messageID)
20
    async messageInfo (jid: string, messageID: string) {
21
        const query = ['query', {type: 'message_info', index: messageID, jid: jid, epoch: this.msgCount.toString()}, null]
22
        const [,,response] = await this.query ({
23
            json: query, 
24
            binaryTags: [WAMetric.queryRead, WAFlag.ignore], 
25
            expect200: true,
26
            requiresPhoneConnection: true
27
        })
28
​
29
        const info: MessageInfo = {reads: [], deliveries: []}
30
        if (response) {
31
            const reads = response.filter (node => node[0] === 'read')
32
            if (reads[0]) {
33
                info.reads = reads[0][2].map (item => item[1])
34
            }
35
            const deliveries = response.filter (node => node[0] === 'delivery')
36
            if (deliveries[0]) {
37
                info.deliveries = deliveries[0][2].map (item => item[1])
38
            }
39
        }
40
        return info
41
    }
42
    /**
43
     * Marks a chat as read/unread; updates the chat object too
44
     * @param jid the ID of the person/group whose message you want to mark read
45
     * @param unread unreads the chat, if true
@fazonetea
Commit changes
Commit summary
Create 7.MessagesExtra.ts
Optional extended description
Add an optional extended description…
 Commit directly to the master branch.
 Create a new branch for this commit and start a pull request. Learn more about pull requests.
 
© 2021 GitHub, Inc.
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
