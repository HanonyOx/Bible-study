import type {
  SundaySchoolAgeGroup,
  SundaySchoolLesson,
} from './sundaySchoolData'

type OriginalLessonContent = Omit<
  SundaySchoolLesson,
  | 'ageGroup'
  | 'contentOrigin'
  | 'curriculumId'
  | 'lessonDate'
  | 'publicationStatus'
  | 'reviewStatus'
  | 'sequenceNumber'
> & {
  ageGroup: SundaySchoolAgeGroup
  sequenceNumber: number
}

function originalLesson(
  lesson: OriginalLessonContent,
): SundaySchoolLesson {
  return {
    ...lesson,
    contentOrigin: 'original_word_and_way',
    curriculumId: 'word-and-way-original-studies-2026',
    lessonDate: null,
    publicationStatus: 'draft',
    reviewStatus: 'not_reviewed',
  }
}

export const originalSundaySchoolLessons: SundaySchoolLesson[] = [
  originalLesson({
    id: 'children-god-creates-the-world',
    title: 'God Creates the World',
    ageGroup: 'children',
    sequenceNumber: 1,
    mainScriptureReference: 'Genesis 1:1–31',
    scriptureReferences: ['Genesis 1:1–31'],
    learningObjectives: [
      'Describe creation as God’s work and recognize that it is called good.',
      'Name ways people can care for the world and one another.',
      'Explain that every part of creation depends on God.',
    ],
    introduction:
      'Invite learners to name something in nature they enjoy. Genesis begins by showing that the world is not an accident in the story: God creates, gives life, brings order, and calls creation good.',
    teachingPoints: [
      {
        title: 'God is the beginning',
        studentContent:
          'Genesis 1:1–2 presents God before the ordered world and describes the earth as unformed. God speaks and creation begins; the story gives God the initiative.',
      },
      {
        title: 'God brings order and life',
        studentContent:
          'Across the six days, God makes light, sky, land, plants, lights in the sky, living creatures, and human beings. Repeatedly, God sees that what is made is good.',
      },
      {
        title: 'People have a special responsibility',
        studentContent:
          'In verses 26–31, human beings are made in God’s image and given responsibility within creation. Their role is care and stewardship, not permission to treat others or the earth carelessly.',
      },
    ],
    practicalApplication:
      'Choose one act of care this week: keep a shared space clean, handle plants and animals gently, or include someone who is being left out.',
    discussionQuestions: [
      'What does the repeated phrase “God saw that it was good” tell us about creation?',
      'Which part of the creation account do you remember most clearly, and why?',
      'What is one practical way children can care for creation?',
    ],
    memoryVerseReference: 'Genesis 1:31',
    closingPrayer:
      'Creator God, thank you for the good world you made. Help us care for it and treat every person with respect. Amen.',
    ageAppropriateExplanation:
      'The Bible tells us that God made the world and everything in it. God called creation good and gave people the job of caring for it.',
    interactiveActivity:
      'Make a “care for creation” circle: each learner names one created thing and one gentle, practical way to care for it. Draw or act out one of the ideas.',
    simpleTakeaway: 'God made a good world and asks us to care for it.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'children-noah-obeys-god',
    title: 'Noah Obeys God',
    ageGroup: 'children',
    sequenceNumber: 2,
    mainScriptureReference: 'Genesis 6:9–22',
    scriptureReferences: ['Genesis 6:9–22'],
    learningObjectives: [
      'Identify Noah as a person described as righteous in his generation.',
      'Explain that Noah acted on God’s instructions.',
      'Name a safe, wise action a child can take when asked to do what is right.',
    ],
    introduction:
      'Ask learners what makes a person trustworthy. Genesis 6 describes a violent and corrupt world, then focuses on Noah, who walked with God and listened to detailed instructions.',
    teachingPoints: [
      {
        title: 'Noah’s character stood out',
        studentContent:
          'Verses 9–10 describe Noah as righteous, blameless among his contemporaries, and walking with God. The passage contrasts his life with the violence around him.',
      },
      {
        title: 'God gave Noah a difficult task',
        studentContent:
          'God told Noah to build an ark and gave its dimensions and construction details. The work would have required time, effort, and trust.',
      },
      {
        title: 'Noah followed the instructions',
        studentContent:
          'The account says Noah did all that God commanded. Obedience here is concrete action in response to God, not merely saying that he agreed.',
      },
    ],
    practicalApplication:
      'When a trusted adult gives a safe and wise instruction, practise listening carefully and completing it. If an instruction feels unsafe, tell a trusted caregiver rather than keeping it secret.',
    discussionQuestions: [
      'What words does the passage use to describe Noah?',
      'Why might building the ark have required patience?',
      'How can you tell a trusted adult when you are unsure about an instruction?',
    ],
    memoryVerseReference: 'Genesis 6:22',
    closingPrayer:
      'God, help us listen to you and choose what is right. Give us patience to do good things faithfully. Amen.',
    ageAppropriateExplanation:
      'Noah listened to God and carefully followed the instructions God gave him. The story teaches us to do what is right and to ask a trusted adult for help when we feel unsure.',
    interactiveActivity:
      'In small groups, build a simple paper or block structure from a short set of instructions. Discuss how careful listening and teamwork helped.',
    simpleTakeaway: 'Listening carefully helps us follow through on what is right.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'children-joseph-chooses-forgiveness',
    title: 'Joseph Chooses Forgiveness',
    ageGroup: 'children',
    sequenceNumber: 3,
    mainScriptureReference: 'Genesis 45:1–15',
    scriptureReferences: ['Genesis 45:1–15'],
    learningObjectives: [
      'Retell how Joseph revealed himself to his brothers.',
      'Recognize Joseph’s care for his family after their past harm.',
      'Understand that forgiveness does not mean pretending hurtful actions were good.',
    ],
    introduction:
      'Remind learners that Joseph’s brothers had sold him, and years later he became a leader in Egypt. In Genesis 45 the brothers meet him again during a famine, but they do not yet know who he is.',
    teachingPoints: [
      {
        title: 'Joseph tells the truth about who he is',
        studentContent:
          'Joseph weeps and says, “I am Joseph.” His brothers are frightened. The passage does not hide the pain or shock of this family reunion.',
      },
      {
        title: 'Joseph sees God’s care in the crisis',
        studentContent:
          'In verses 5–8 Joseph says God sent him ahead to preserve life during the famine. He does not call the brothers’ earlier wrongdoing good; he describes how God worked to save lives despite it.',
      },
      {
        title: 'Joseph offers practical care',
        studentContent:
          'Joseph tells his brothers to bring their father and household to Egypt, where they can survive the remaining famine. His response includes concrete help and renewed relationship.',
      },
    ],
    practicalApplication:
      'If someone has hurt you, talk with a safe, trusted adult. Forgiveness can be a process; it does not require staying in danger, hiding harm, or immediately trusting someone again.',
    discussionQuestions: [
      'How do Joseph’s brothers react when he identifies himself?',
      'What does Joseph say about God’s purpose during the famine?',
      'What is the difference between forgiving someone and saying their harmful choice was okay?',
    ],
    memoryVerseReference: 'Genesis 45:5',
    closingPrayer:
      'God, help us bring hurt to trusted people and learn to forgive wisely. Thank you that you can bring help and hope even after wrong choices. Amen.',
    ageAppropriateExplanation:
      'Joseph’s brothers had hurt him. When they met again, Joseph chose to help his family during a terrible famine. Forgiving does not mean hurt was okay or that we must hide danger.',
    interactiveActivity:
      'Use two paper cards labelled “hurt” and “help.” Learners name safe ways to seek help after being hurt and kind actions that can begin repair, without sharing private experiences.',
    simpleTakeaway: 'We can seek help and choose forgiveness without hiding harm.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'children-moses-is-called',
    title: 'Moses Is Called by God',
    ageGroup: 'children',
    sequenceNumber: 4,
    mainScriptureReference: 'Exodus 3:1–12',
    scriptureReferences: ['Exodus 3:1–12'],
    learningObjectives: [
      'Describe what Moses saw at Horeb.',
      'Explain the mission God gave Moses to lead Israel out of Egypt.',
      'Remember God’s promise to be with Moses.',
    ],
    introduction:
      'Ask what it feels like to be asked to do something difficult. Moses was tending sheep when an unusual sight stopped him, and God spoke to him about the suffering of the Israelites in Egypt.',
    teachingPoints: [
      {
        title: 'God gets Moses’ attention',
        studentContent:
          'Moses sees a bush burning without being consumed and turns aside to look. God calls Moses by name, and Moses answers.',
      },
      {
        title: 'God sees the people’s suffering',
        studentContent:
          'God says that he has seen Israel’s affliction, heard their cries, and knows their suffering. God’s call is connected to liberation and care for an oppressed people.',
      },
      {
        title: 'God promises to be with Moses',
        studentContent:
          'Moses feels small for the task, but God’s answer is, “I will be with you.” The passage grounds Moses’ mission in God’s presence, not Moses’ confidence alone.',
      },
    ],
    practicalApplication:
      'When a child notices someone being excluded or treated unfairly, they can tell a trusted adult and offer safe kindness rather than trying to solve a dangerous situation alone.',
    discussionQuestions: [
      'What made Moses turn aside to look at the bush?',
      'What did God say he had seen and heard?',
      'What promise did God give Moses when he felt unable?',
    ],
    memoryVerseReference: 'Exodus 3:12',
    closingPrayer:
      'God, thank you for seeing people who are hurting. Help us do kind and safe things, and remind us that you are with us. Amen.',
    ageAppropriateExplanation:
      'God saw that the Israelites were suffering and called Moses to help lead them to freedom. Moses was worried, but God promised to be with him.',
    interactiveActivity:
      'Act out the scene in pairs: one learner is Moses noticing the bush, another narrates what God sees and promises. Keep the focus on listening and God’s promise.',
    simpleTakeaway: 'God sees suffering and stays with those he calls to help.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'children-david-faces-goliath',
    title: 'David Faces Goliath',
    ageGroup: 'children',
    sequenceNumber: 5,
    mainScriptureReference: '1 Samuel 17:32–50',
    scriptureReferences: ['1 Samuel 17:32–50'],
    learningObjectives: [
      'Explain why David trusted God when he faced Goliath.',
      'Notice that David refused armor that did not fit him.',
      'Identify courage as trusting God and taking a wise next step.',
    ],
    introduction:
      'The Israelite army is afraid of Goliath. David, a young shepherd, tells Saul that he will go. Ask learners whether courage always means feeling unafraid.',
    teachingPoints: [
      {
        title: 'David remembers God’s past help',
        studentContent:
          'David tells Saul how God helped him protect sheep from a lion and a bear. He sees the present danger in light of God’s faithfulness.',
      },
      {
        title: 'David refuses what does not fit',
        studentContent:
          'Saul puts his armor on David, but David cannot move comfortably in it. He takes it off and chooses his familiar staff, sling, and stones.',
      },
      {
        title: 'David names the source of victory',
        studentContent:
          'David says the battle belongs to the Lord and that the Lord does not save by sword or spear. He runs toward the challenge trusting God, rather than boasting in weapons.',
      },
    ],
    practicalApplication:
      'When facing a hard but safe task, remember help you have received, prepare with the skills you have, and ask a trusted person to support you.',
    discussionQuestions: [
      'What experiences did David remember when he spoke to Saul?',
      'Why did David take off Saul’s armor?',
      'What does David say is more important than a sword or spear?',
    ],
    memoryVerseReference: '1 Samuel 17:47',
    closingPrayer:
      'God, thank you for being faithful. Give us courage to do what is right, wisdom to prepare, and humility to trust you. Amen.',
    ageAppropriateExplanation:
      'David was afraid of no challenge because he remembered God’s help. He used what he knew and trusted God instead of pretending to be someone else.',
    interactiveActivity:
      'Make a “courage toolkit” card with three words: remember, prepare, ask. Learners add one safe example of each for a school or home challenge.',
    simpleTakeaway: 'Courage remembers God’s help and takes a faithful next step.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'children-daniel-remains-faithful',
    title: 'Daniel Remains Faithful',
    ageGroup: 'children',
    sequenceNumber: 6,
    mainScriptureReference: 'Daniel 6:1–23',
    scriptureReferences: ['Daniel 6:1–23'],
    learningObjectives: [
      'Describe Daniel’s reputation at work in the kingdom.',
      'Explain the conflict created by the new law.',
      'Recognize Daniel’s steady prayer and God’s deliverance.',
    ],
    introduction:
      'Daniel served under a new king and was trusted because he was dependable. Some officials became jealous and used a law against prayer to target him.',
    teachingPoints: [
      {
        title: 'Daniel is trustworthy',
        studentContent:
          'Verses 1–5 show that Daniel’s excellent work and faithfulness made his rivals jealous. They could find no corruption in his work, so they looked for a way to attack his devotion to God.',
      },
      {
        title: 'Daniel continues his established prayer',
        studentContent:
          'When the law is signed, Daniel continues to pray as he had done before. His prayer is not a sudden performance; it is part of his regular relationship with God.',
      },
      {
        title: 'God is with Daniel in danger',
        studentContent:
          'Daniel is thrown into the lions’ den, and God shuts the lions’ mouths. The story credits God with deliverance and shows the king’s recognition of God’s power.',
      },
    ],
    practicalApplication:
      'Build a simple habit of prayer and honesty. If a rule or peer pressure asks you to hurt someone or do something unsafe, talk to a trusted adult immediately.',
    discussionQuestions: [
      'What qualities made Daniel dependable?',
      'What did Daniel do after he learned about the new law?',
      'Who can you speak with if you feel pressured to do something unsafe?',
    ],
    memoryVerseReference: 'Daniel 6:10',
    closingPrayer:
      'God, help us be honest and faithful in everyday choices. Give us courage and bring us help when we face danger. Amen.',
    ageAppropriateExplanation:
      'Daniel kept praying to God even when a new law tried to stop him. God protected Daniel, and Daniel continued to trust God.',
    interactiveActivity:
      'Create a weekly “quiet moment” wheel. Learners choose one short, realistic time for prayer or reflection and draw a reminder symbol.',
    simpleTakeaway: 'A steady relationship with God helps us remain faithful.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'children-jesus-welcomes-children',
    title: 'Jesus Welcomes Children',
    ageGroup: 'children',
    sequenceNumber: 7,
    mainScriptureReference: 'Mark 10:13–16',
    scriptureReferences: ['Mark 10:13–16'],
    learningObjectives: [
      'Retell how the disciples treated the people bringing children.',
      'Explain Jesus’ response to the disciples.',
      'Describe one way a group can welcome children.',
    ],
    introduction:
      'Imagine arriving somewhere and being told you are not important enough to come near. In Mark 10, people bring children to Jesus, but the disciples rebuke them.',
    teachingPoints: [
      {
        title: 'The disciples try to keep children away',
        studentContent:
          'People bring children for Jesus to touch them, and the disciples rebuke those bringing them. The passage shows how adults can wrongly put barriers between children and Jesus.',
      },
      {
        title: 'Jesus says children should come',
        studentContent:
          'Jesus is indignant and tells the disciples to let the children come and not hinder them. He says the kingdom of God belongs to such as these.',
      },
      {
        title: 'Jesus blesses the children',
        studentContent:
          'Jesus takes the children in his arms, lays his hands on them, and blesses them. His welcome is personal and active.',
      },
    ],
    practicalApplication:
      'Welcome younger children into a group by learning their names, listening to them, and making room for their participation.',
    discussionQuestions: [
      'What did the disciples do when people brought children?',
      'How did Jesus respond to the disciples?',
      'What can you do so someone younger feels included?',
    ],
    memoryVerseReference: 'Mark 10:14',
    closingPrayer:
      'Jesus, thank you for welcoming children. Help us welcome others and make sure nobody is pushed away. Amen.',
    ageAppropriateExplanation:
      'Jesus told the disciples not to stop children from coming to him. He held the children and blessed them.',
    interactiveActivity:
      'Practise a welcome circle: learners take turns greeting a pretend newcomer by name and inviting them into a simple group activity.',
    simpleTakeaway: 'Jesus welcomes children, and we should welcome one another.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'children-good-samaritan',
    title: 'The Good Samaritan',
    ageGroup: 'children',
    sequenceNumber: 8,
    mainScriptureReference: 'Luke 10:25–37',
    scriptureReferences: ['Luke 10:25–37'],
    learningObjectives: [
      'Identify the actions of the Samaritan in Jesus’ story.',
      'Explain how Jesus answers the question “Who is my neighbor?”',
      'Choose a safe way to show compassion to someone in need.',
    ],
    introduction:
      'A law expert asks Jesus what he must do to inherit eternal life and later asks, “Who is my neighbor?” Jesus answers with a story about a wounded traveller.',
    teachingPoints: [
      {
        title: 'Two travellers pass by',
        studentContent:
          'A priest and a Levite see the injured man and pass on the other side. Jesus does not give their reasons; the story emphasizes that they do not help.',
      },
      {
        title: 'The Samaritan shows mercy',
        studentContent:
          'The Samaritan sees the man, feels compassion, treats his wounds, and takes him to an inn. He gives time and resources for the man’s care.',
      },
      {
        title: 'Jesus calls the listener to act',
        studentContent:
          'Jesus asks which traveller acted as a neighbor. The answer is the one who showed mercy. Jesus tells the questioner to go and do likewise.',
      },
    ],
    practicalApplication:
      'If someone is hurt or unsafe, get a responsible adult or emergency help. Children should not approach danger alone; kindness includes getting safe help.',
    discussionQuestions: [
      'What did the Samaritan do after seeing the injured man?',
      'How did Jesus answer the question about who was a neighbor?',
      'What is a safe way to help a classmate who is struggling?',
    ],
    memoryVerseReference: 'Luke 10:37',
    closingPrayer:
      'God, give us compassionate hearts. Help us notice people in need and find safe, practical ways to show mercy. Amen.',
    ageAppropriateExplanation:
      'Jesus’ story shows a Samaritan caring for an injured stranger. A neighbor is someone we treat with mercy.',
    interactiveActivity:
      'Put picture cards of everyday needs in a bowl. Learners suggest a safe, age-appropriate response for each, including when to call an adult.',
    simpleTakeaway: 'A neighbor shows mercy through practical care.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'children-lost-sheep',
    title: 'The Lost Sheep',
    ageGroup: 'children',
    sequenceNumber: 9,
    mainScriptureReference: 'Luke 15:1–7',
    scriptureReferences: ['Luke 15:1–7'],
    learningObjectives: [
      'Explain why Jesus told the parable of the lost sheep.',
      'Describe the shepherd’s response when one sheep is lost.',
      'Recognize the joy Jesus describes when a sinner repents.',
    ],
    introduction:
      'Tax collectors and sinners were gathering to hear Jesus, while Pharisees and teachers complained that he welcomed them. Jesus responds with a parable about a shepherd and one lost sheep.',
    teachingPoints: [
      {
        title: 'The shepherd notices the one missing',
        studentContent:
          'The shepherd has one hundred sheep and leaves the ninety-nine in the open country while searching for the lost one until he finds it. The story highlights the value of the one who is missing.',
      },
      {
        title: 'The shepherd carries the sheep home',
        studentContent:
          'When he finds the sheep, he joyfully puts it on his shoulders and calls friends and neighbors to celebrate. The response is care and joy, not scolding.',
      },
      {
        title: 'Heaven rejoices over repentance',
        studentContent:
          'Jesus explains that there is joy in heaven over one sinner who repents. The parable answers criticism of Jesus’ welcome by showing God’s concern for the lost.',
      },
    ],
    practicalApplication:
      'Notice when someone is left out and invite them to join. If you feel lost or have done wrong, speak honestly with a trusted adult and remember that turning back is welcomed.',
    discussionQuestions: [
      'Why did Jesus tell this story?',
      'What did the shepherd do when he found the sheep?',
      'What does Jesus say brings joy in heaven?',
    ],
    memoryVerseReference: 'Luke 15:6–7',
    closingPrayer:
      'God, thank you that you seek and welcome those who turn back to you. Help us welcome people with care and joy. Amen.',
    ageAppropriateExplanation:
      'Jesus told a story about a shepherd who searched for one lost sheep and celebrated when he found it. Jesus said heaven rejoices when someone turns back to God.',
    interactiveActivity:
      'Hide a paper sheep in the room. One learner finds it while others give gentle directions, then the group discusses how it feels to be noticed and welcomed.',
    simpleTakeaway: 'God cares about people who feel lost and rejoices when they return.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'children-jesus-calms-the-storm',
    title: 'Jesus Calms the Storm',
    ageGroup: 'children',
    sequenceNumber: 10,
    mainScriptureReference: 'Mark 4:35–41',
    scriptureReferences: ['Mark 4:35–41'],
    learningObjectives: [
      'Retell what happened in the boat during the storm.',
      'Describe how Jesus responded to the wind and waves.',
      'Name a trusted person to seek when fear feels overwhelming.',
    ],
    introduction:
      'Jesus and the disciples cross the lake after a day of teaching. Ask learners what helps them when something frightening happens.',
    teachingPoints: [
      {
        title: 'A dangerous storm rises',
        studentContent:
          'Waves break over the boat until it is filling with water. Some disciples are experienced fishermen, yet they fear they will drown.',
      },
      {
        title: 'The disciples wake Jesus',
        studentContent:
          'Jesus is asleep in the stern. The disciples wake him and ask whether he cares that they are perishing. They bring their fear honestly to him.',
      },
      {
        title: 'Jesus stills the storm and asks about faith',
        studentContent:
          'Jesus rebukes the wind and tells the sea to be still. The storm ceases, and the disciples wonder who he is. The passage presents Jesus’ authority and also acknowledges the disciples’ fear.',
      },
    ],
    practicalApplication:
      'When you are afraid, tell a trusted adult what is happening, take slow breaths, and pray if that helps you. This story does not mean every frightening situation ends immediately, but it shows that we can bring fear to Jesus.',
    discussionQuestions: [
      'What did the disciples see happening to the boat?',
      'What did they ask Jesus?',
      'Who can help you when you feel unsafe or very afraid?',
    ],
    memoryVerseReference: 'Mark 4:39',
    closingPrayer:
      'Jesus, thank you that we can bring our fears to you. Help us seek wise help and remember your care. Amen.',
    ageAppropriateExplanation:
      'A storm frightened the disciples while they were in a boat. Jesus stopped the wind and waves, and the disciples learned more about his authority.',
    interactiveActivity:
      'Use a paper boat and a bowl of water to gently make waves, then settle them. Learners name safe people and calming actions they can use when worried.',
    simpleTakeaway: 'We can bring our fears to Jesus and ask trusted people for help.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'children-boy-shares-food',
    title: 'The Boy Who Shared His Food',
    ageGroup: 'children',
    sequenceNumber: 11,
    mainScriptureReference: 'John 6:1–13',
    scriptureReferences: ['John 6:1–13'],
    learningObjectives: [
      'Identify the food the boy had with him.',
      'Explain how Jesus involved the disciples in feeding the crowd.',
      'Choose a realistic way to share or help others.',
    ],
    introduction:
      'A large crowd follows Jesus. Jesus asks Philip where bread can be bought, testing him; Andrew points out a boy with five barley loaves and two fish, while noting how small the amount seems.',
    teachingPoints: [
      {
        title: 'The need is bigger than the visible supply',
        studentContent:
          'About five thousand men are present. Philip calculates the cost, and Andrew sees the boy’s food but asks what it can do for so many.',
      },
      {
        title: 'Jesus gives thanks and distributes the food',
        studentContent:
          'Jesus has the people sit down, takes the loaves, gives thanks, and distributes the food, along with the fish, as much as they want.',
      },
      {
        title: 'The leftovers are gathered carefully',
        studentContent:
          'After everyone eats, Jesus tells the disciples to gather the leftovers so nothing is wasted. They fill twelve baskets with pieces from the five barley loaves.',
      },
    ],
    practicalApplication:
      'Sharing can mean food, time, attention, or a useful skill. Ask a caregiver or community leader how to share safely and respectfully, especially when meeting someone’s needs.',
    discussionQuestions: [
      'What food did the boy have?',
      'What did Jesus do before the food was distributed?',
      'Why do you think Jesus told the disciples to gather the leftovers?',
    ],
    memoryVerseReference: 'John 6:11',
    closingPrayer:
      'Jesus, thank you for providing and teaching us not to waste. Help us share what we can with care. Amen.',
    ageAppropriateExplanation:
      'A boy had five loaves and two fish. Jesus gave thanks, fed a huge crowd, and made sure the extra food was gathered.',
    interactiveActivity:
      'With counters or paper shapes, model a small supply being shared among a group, then collect the remaining pieces. Discuss what “enough” and “not wasting” mean.',
    simpleTakeaway: 'Offer what you can and use gifts carefully.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'children-early-church-shares',
    title: 'The Early Church Shares',
    ageGroup: 'children',
    sequenceNumber: 12,
    mainScriptureReference: 'Acts 2:42–47',
    scriptureReferences: ['Acts 2:42–47'],
    learningObjectives: [
      'Name practices the early believers shared.',
      'Explain how they responded when people had needs.',
      'Identify a safe way to contribute to a caring community.',
    ],
    introduction:
      'After Peter’s message at Pentecost, many people are baptized and become part of the community of believers. Acts describes what their new life together looked like.',
    teachingPoints: [
      {
        title: 'They learn and worship together',
        studentContent:
          'The believers devote themselves to the apostles’ teaching, fellowship, breaking bread, and prayers. Their faith is practiced together, not only in private.',
      },
      {
        title: 'They share with people in need',
        studentContent:
          'The passage says they sold possessions and goods and distributed to anyone as they had need. Their generosity responded to real needs in the community.',
      },
      {
        title: 'Their shared life is visible',
        studentContent:
          'They meet in the temple and in homes, eat with glad and sincere hearts, praise God, and have goodwill among the people. The community’s life gives witness.',
      },
    ],
    practicalApplication:
      'Contribute through a safe group activity: share supplies, help set up, or include a classmate. Ask a trusted adult before giving money or personal items.',
    discussionQuestions: [
      'What four things did the believers devote themselves to?',
      'How did the community respond to people’s needs?',
      'What can our group share safely this week?',
    ],
    memoryVerseReference: 'Acts 2:44–45',
    closingPrayer:
      'God, thank you for people who learn, pray, and care together. Show us how to share wisely and include others. Amen.',
    ageAppropriateExplanation:
      'The first believers learned about Jesus, prayed, ate together, and shared so people in need received help.',
    interactiveActivity:
      'Plan a pretend class “helping table” using cards for time, skills, supplies, and care. Choose one supervised action the class could actually do.',
    simpleTakeaway: 'A caring faith community learns together and shares wisely.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'teens-identity-and-worth',
    title: 'Identity and Worth',
    ageGroup: 'teens',
    sequenceNumber: 1,
    mainScriptureReference: 'Psalm 139:13–18',
    scriptureReferences: ['Psalm 139:13–18'],
    learningObjectives: [
      'Explain the psalmist’s image of being formed and known by God.',
      'Distinguish God-given worth from popularity or performance.',
      'Choose a supportive response to comparison or self-criticism.',
    ],
    introduction:
      'Social media, grades, appearance, and peer approval can make worth feel conditional. Psalm 139 is a prayer that describes God’s intimate knowledge and the wonder of human life.',
    teachingPoints: [
      {
        title: 'The psalm describes God’s involvement in life',
        studentContent:
          'Verses 13–15 use the image of God forming the speaker in the womb and seeing the hidden beginning of life. The poetry expresses reverence for God’s work, not a scorecard of achievement.',
      },
      {
        title: 'The speaker is fully known',
        studentContent:
          'Verse 16 says the speaker’s days were known to God. In the surrounding psalm, God’s knowledge is personal and comprehensive; the speaker is not invisible to God.',
      },
      {
        title: 'Wonder leads to reflection',
        studentContent:
          'The psalmist calls God’s thoughts precious and beyond counting. The passage invites humility and awe rather than making popularity or performance the measure of a person.',
      },
    ],
    practicalApplication:
      'When comparison becomes heavy, name one quality or relationship you value that is not based on appearance or achievement. If thoughts about your worth become distressing, talk with a trusted adult or counselor.',
    discussionQuestions: [
      'What images does the psalm use to describe God’s knowledge of the speaker?',
      'How can online comparison distort a person’s sense of worth?',
      'Who is a safe person to approach when self-criticism feels overwhelming?',
    ],
    memoryVerseReference: 'Psalm 139:14',
    closingPrayer:
      'God, thank you that our lives are known to you. Help us resist harmful comparison and treat ourselves and others with dignity. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'teens-choosing-wise-friends',
    title: 'Choosing Wise Friends',
    ageGroup: 'teens',
    sequenceNumber: 2,
    mainScriptureReference: 'Proverbs 13:20',
    scriptureReferences: ['Proverbs 13:20'],
    learningObjectives: [
      'Interpret the proverb’s contrast between walking with the wise and associating with fools.',
      'Identify how repeated relationships can shape habits and judgment.',
      'Practise setting a respectful boundary around harmful pressure.',
    ],
    introduction:
      'A friend group can influence how someone speaks, spends time, handles conflict, and makes risky choices. Proverbs 13:20 is a compact wisdom saying about the company we keep.',
    teachingPoints: [
      {
        title: '“Walking” suggests ongoing influence',
        studentContent:
          'The proverb pictures companionship as walking together. Influence often forms through repeated choices and shared habits, not one dramatic moment.',
      },
      {
        title: 'Wisdom is learned in relationship',
        studentContent:
          'The wise companion grows wiser. Proverbs treats wisdom as practical skill for living well, including listening, self-control, and reverence for God.',
      },
      {
        title: 'Careless company carries consequences',
        studentContent:
          'The second line warns that associating with fools leads to harm. It is a warning to consider influence, not a command to despise people or abandon someone who needs help.',
      },
    ],
    practicalApplication:
      'Think of one relationship that helps you make wise choices and invest in it. If a group pressures you toward harm, prepare a short boundary statement and seek support from a trusted adult.',
    discussionQuestions: [
      'What might “walk with the wise” look like at school or online?',
      'How can you recognize influence that is becoming harmful?',
      'How can you care about someone without copying every choice they make?',
    ],
    memoryVerseReference: 'Proverbs 13:20',
    closingPrayer:
      'God, give us wisdom in our friendships. Help us encourage good choices, set healthy boundaries, and seek wise support. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'teens-handling-peer-pressure',
    title: 'Handling Peer Pressure',
    ageGroup: 'teens',
    sequenceNumber: 3,
    mainScriptureReference: 'Daniel 1:8–17',
    scriptureReferences: ['Daniel 1:8–17'],
    learningObjectives: [
      'Describe Daniel’s concern about the royal food and his respectful request.',
      'Notice the role of preparation, conversation, and testing in the account.',
      'Plan a safe response to pressure that conflicts with conscience or wellbeing.',
    ],
    introduction:
      'Daniel and other young Judeans are taken to Babylon and placed in the king’s training program. Their situation is not simply a normal school choice: they are displaced under an imperial power.',
    teachingPoints: [
      {
        title: 'Daniel makes a considered decision',
        studentContent:
          'Daniel resolves not to defile himself with the king’s food and wine. The text states his conviction but does not specify every reason behind it.',
      },
      {
        title: 'He speaks respectfully and proposes a test',
        studentContent:
          'Daniel asks the chief official for permission. When the official fears consequences, Daniel proposes a ten-day test with vegetables and water, allowing the official to observe the outcome.',
      },
      {
        title: 'Faithfulness includes practical wisdom',
        studentContent:
          'The account says God gave Daniel favor and knowledge, and that the young men appeared healthier after the test. Their faithfulness combines conviction, respectful speech, and an observable plan.',
      },
    ],
    practicalApplication:
      'Before a pressured situation, decide your boundary, practise a calm refusal, and identify a safe adult or friend to contact. Do not try a health or diet experiment from this ancient narrative without qualified guidance.',
    discussionQuestions: [
      'What decision did Daniel make before speaking to the official?',
      'How did Daniel present his request?',
      'What is a practical, safe plan for leaving a pressured situation?',
    ],
    memoryVerseReference: 'Daniel 1:8',
    closingPrayer:
      'God, help us hold to wise convictions with humility. Give us clear words, safe support, and practical wisdom under pressure. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'teens-courage-difficult-situations',
    title: 'Courage in Difficult Situations',
    ageGroup: 'teens',
    sequenceNumber: 4,
    mainScriptureReference: 'Joshua 1:6–9',
    scriptureReferences: ['Joshua 1:6–9'],
    learningObjectives: [
      'Describe Joshua’s responsibility after Moses’ death.',
      'Connect courage in the passage with obedience to God’s instruction.',
      'Choose one supported, constructive next step in a hard situation.',
    ],
    introduction:
      'Joshua is about to lead Israel after Moses’ death. The task is large and uncertain, so God repeatedly tells Joshua to be strong and courageous.',
    teachingPoints: [
      {
        title: 'Joshua’s courage serves a responsibility',
        studentContent:
          'God charges Joshua to lead the people into the land promised to their ancestors. Courage is tied to a concrete calling, not self-promotion.',
      },
      {
        title: 'Courage is joined to careful obedience',
        studentContent:
          'Verses 7–8 tell Joshua to keep and meditate on the law given through Moses. The passage does not define courage as doing whatever feels bold; it is shaped by God’s instruction.',
      },
      {
        title: 'God promises presence',
        studentContent:
          'God tells Joshua not to be afraid or discouraged because the Lord will be with him wherever he goes. The promise addresses a real transition and responsibility.',
      },
    ],
    practicalApplication:
      'For a difficult conversation or new responsibility, prepare the facts, ask a wise person for support, and take one honest step. Courage does not require tolerating abuse or entering unsafe situations.',
    discussionQuestions: [
      'What responsibility was Joshua given?',
      'What practices accompany the command to be courageous?',
      'How can you tell the difference between courage and unnecessary risk?',
    ],
    memoryVerseReference: 'Joshua 1:9',
    closingPrayer:
      'God, stay with us in change and difficult responsibilities. Shape our courage with wisdom, truth, and care for others. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'teens-managing-anger',
    title: 'Managing Anger',
    ageGroup: 'teens',
    sequenceNumber: 5,
    mainScriptureReference: 'James 1:19–20',
    scriptureReferences: ['James 1:19–20'],
    learningObjectives: [
      'Explain James’ instruction to listen, speak, and become angry slowly.',
      'Distinguish feeling anger from acting harmfully.',
      'Practise a pause-and-respond strategy for conflict.',
    ],
    introduction:
      'Messages can be sent quickly and regretted later. James 1:19–20 gives a short sequence for responding to others, especially when tension is rising.',
    teachingPoints: [
      {
        title: 'Listen before answering',
        studentContent:
          'James tells believers to be quick to hear and slow to speak. Listening is an active choice to understand before preparing a comeback.',
      },
      {
        title: 'Slow anger down',
        studentContent:
          'The instruction is to be slow to anger, not to pretend that injustice or hurt does not matter. A pause can keep a strong feeling from controlling the next action.',
      },
      {
        title: 'Human anger cannot produce God’s righteousness',
        studentContent:
          'Verse 20 says human anger does not produce the righteousness God desires. James evaluates anger by its fruit and its ability to do what is right.',
      },
    ],
    practicalApplication:
      'When upset, pause before replying, name the concern without insults, and return to the conversation when calm. If someone is threatening or abusive, prioritize safety and involve a trusted adult.',
    discussionQuestions: [
      'What order does James give for listening, speaking, and anger?',
      'Why is a pause useful before responding online?',
      'What can you say to set a boundary without attacking someone?',
    ],
    memoryVerseReference: 'James 1:19',
    closingPrayer:
      'God, help us listen carefully and speak with care. Teach us to respond to anger without causing harm. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'teens-words-build-others',
    title: 'Words That Build Others',
    ageGroup: 'teens',
    sequenceNumber: 6,
    mainScriptureReference: 'Ephesians 4:29',
    scriptureReferences: ['Ephesians 4:29'],
    learningObjectives: [
      'Describe the kind of speech Ephesians rejects and the speech it encourages.',
      'Apply the tests of usefulness, need, and encouragement to communication.',
      'Plan how to repair harm caused by careless words.',
    ],
    introduction:
      'Group chats and public comments can spread quickly. Ephesians 4 describes a new way of life in the community and gives a specific instruction about speech.',
    teachingPoints: [
      {
        title: 'Do not use speech that tears down',
        studentContent:
          'The verse says corrupting talk should not come from the mouth. In its context, the instruction belongs to a community learning a changed way of living.',
      },
      {
        title: 'Speak what is useful for building up',
        studentContent:
          'Speech should fit the need and benefit those who hear. Encouragement is not flattery; it is truthful communication that helps rather than humiliates.',
      },
      {
        title: 'Words can be timed to the moment',
        studentContent:
          'The verse says to give grace to those who hear. Good speech considers the person, need, and moment instead of posting whatever earns attention.',
      },
    ],
    practicalApplication:
      'Before posting, ask: Is it true? Is it needed? Will it help? If you shared harmful words, remove them where possible, apologize without excuses, and seek help if harassment is involved.',
    discussionQuestions: [
      'What does “building up” look like in a disagreement?',
      'How can a message that gets laughs still cause harm?',
      'What steps make an apology more than just “sorry you felt that way”?',
    ],
    memoryVerseReference: 'Ephesians 4:29',
    closingPrayer:
      'God, guide our words in person and online. Help us speak truth with grace and repair harm when our words wound. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'teens-forgiveness-reconciliation',
    title: 'Forgiveness and Reconciliation',
    ageGroup: 'teens',
    sequenceNumber: 7,
    mainScriptureReference: 'Matthew 18:21–35',
    scriptureReferences: ['Matthew 18:21–35'],
    learningObjectives: [
      'Summarize the contrast in Jesus’ parable between received mercy and withheld mercy.',
      'Explain how forgiveness relates to the passage’s picture of God’s kingdom.',
      'Distinguish forgiveness from unsafe or unearned restoration of trust.',
    ],
    introduction:
      'Peter asks Jesus how often he must forgive a brother or sister who sins against him. Jesus answers with a parable about a servant released from an enormous debt.',
    teachingPoints: [
      {
        title: 'The king releases a debt the servant cannot repay',
        studentContent:
          'The first servant owes an impossible amount. The king responds to his plea with compassion and cancels the debt.',
      },
      {
        title: 'The forgiven servant refuses mercy to another',
        studentContent:
          'The same servant demands payment from a fellow servant over a much smaller debt and has him imprisoned. Other servants are distressed and report what happened.',
      },
      {
        title: 'Jesus warns against refusing mercy',
        studentContent:
          'The king confronts the servant for failing to show the mercy he received. Jesus concludes that forgiveness must come from the heart. The parable does not command victims to hide harm or restore unsafe access.',
      },
    ],
    practicalApplication:
      'Forgiveness may take time and can coexist with boundaries, consequences, and seeking help. Reconciliation requires truth, safety, and changed behavior; discuss serious harm with a trusted adult or qualified counselor.',
    discussionQuestions: [
      'What contrast does Jesus create between the two servants?',
      'Why are the other servants distressed?',
      'How can forgiveness and a protective boundary exist together?',
    ],
    memoryVerseReference: 'Matthew 18:33',
    closingPrayer:
      'God, thank you for mercy. Help us forgive honestly, seek justice and safety where needed, and become people who do not withhold compassion. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'teens-faith-during-uncertainty',
    title: 'Faith During Uncertainty',
    ageGroup: 'teens',
    sequenceNumber: 8,
    mainScriptureReference: 'Proverbs 3:5–6',
    scriptureReferences: ['Proverbs 3:5–6'],
    learningObjectives: [
      'Interpret the proverb’s contrast between trusting God and relying only on one’s own understanding.',
      'Describe what acknowledging God in one’s paths can mean.',
      'Use prayer, counsel, and evidence in an uncertain decision.',
    ],
    introduction:
      'Uncertainty about friendships, exams, family changes, or the future can make people demand a perfect answer immediately. Proverbs 3:5–6 offers wisdom about trust and direction.',
    teachingPoints: [
      {
        title: 'Trust involves the whole heart',
        studentContent:
          'The proverb calls the learner to trust the Lord with all the heart. It addresses the center of loyalty and dependence, not just a passing feeling.',
      },
      {
        title: 'Do not make your own understanding the only guide',
        studentContent:
          'The verse warns against leaning on one’s own understanding. It does not forbid thinking; it cautions that human perspective is limited and needs God’s wisdom.',
      },
      {
        title: 'Acknowledge God in the path',
        studentContent:
          'The learner is to acknowledge God in all their ways, with the promise that God will make paths straight. The image is guidance for faithful living, not a guarantee of an effortless outcome.',
      },
    ],
    practicalApplication:
      'For a real decision, list what you know, pray, consult a trustworthy and informed person, and choose the next honest step. Avoid treating a verse as permission to ignore evidence or safety.',
    discussionQuestions: [
      'What does “leaning” on your own understanding suggest?',
      'Who can offer wise and trustworthy counsel for a decision?',
      'How can trust in God help without promising an easy result?',
    ],
    memoryVerseReference: 'Proverbs 3:5–6',
    closingPrayer:
      'God, guide us when we cannot see the whole path. Help us trust you, think carefully, and seek wise counsel. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'teens-prayer-personal-growth',
    title: 'Prayer and Personal Growth',
    ageGroup: 'teens',
    sequenceNumber: 9,
    mainScriptureReference: 'Matthew 6:5–13',
    scriptureReferences: ['Matthew 6:5–13'],
    learningObjectives: [
      'Identify Jesus’ warnings against performative and empty prayer.',
      'Explain the main concerns in the Lord’s Prayer.',
      'Build a simple prayer rhythm that includes God, needs, forgiveness, and guidance.',
    ],
    introduction:
      'In the Sermon on the Mount, Jesus teaches about prayer. He challenges prayer used to impress people and gives his disciples a pattern for addressing God.',
    teachingPoints: [
      {
        title: 'Prayer is not a performance',
        studentContent:
          'Jesus warns against praying to be seen by others and against thinking that many words force God to listen. He describes prayer as relationship with the Father who knows what is needed.',
      },
      {
        title: 'The prayer begins with God',
        studentContent:
          'The Lord’s Prayer begins with God’s name, kingdom, and will. It sets personal requests within a desire for God’s reign and purposes.',
      },
      {
        title: 'The prayer includes ordinary and moral needs',
        studentContent:
          'The prayer asks for daily bread, forgiveness, and deliverance from temptation. Jesus’ pattern joins dependence on God with receiving and extending forgiveness.',
      },
    ],
    practicalApplication:
      'Try a brief daily pattern: address God, name one thing you are grateful for, ask for a real need, seek forgiveness or strength to forgive, and ask for guidance.',
    discussionQuestions: [
      'What does Jesus criticize about prayer done for an audience?',
      'Why does the prayer ask for daily bread rather than endless wealth?',
      'Which part of the prayer would help you most in a stressful week?',
    ],
    memoryVerseReference: 'Matthew 6:9–13',
    closingPrayer:
      'Our Father, teach us to pray sincerely. Give us what we need, forgive us, help us forgive, and guide us away from harm. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'teens-using-time-wisely',
    title: 'Using Time Wisely',
    ageGroup: 'teens',
    sequenceNumber: 10,
    mainScriptureReference: 'Ephesians 5:15–17',
    scriptureReferences: ['Ephesians 5:15–17'],
    learningObjectives: [
      'Explain the contrast between wise and unwise living in the passage.',
      'Interpret “making the most of the time” in its context.',
      'Make a realistic plan balancing responsibilities, rest, and service.',
    ],
    introduction:
      'A full schedule can still be poorly ordered. Ephesians 5 calls believers to live carefully, make good use of time, and understand the Lord’s will.',
    teachingPoints: [
      {
        title: 'Pay attention to how you live',
        studentContent:
          'The passage tells readers to be careful how they live, not as unwise but as wise. Wisdom is shown in deliberate choices rather than drifting without thought.',
      },
      {
        title: 'The days require discernment',
        studentContent:
          'The phrase “making the most of the time” appears with the reason that the days are evil. It calls for alert, faithful use of opportunities in a difficult world.',
      },
      {
        title: 'Seek understanding of God’s will',
        studentContent:
          'Verse 17 contrasts foolishness with understanding the Lord’s will. The passage points beyond productivity toward a life shaped by God’s purposes.',
      },
    ],
    practicalApplication:
      'Review one week of commitments. Set aside time for sleep, learning, responsibilities, relationships, and worship. Ask for help if overload is affecting health or wellbeing.',
    discussionQuestions: [
      'What does careful living look like beyond filling every minute?',
      'Which opportunities in your week deserve attention?',
      'How can rest fit into wise use of time?',
    ],
    memoryVerseReference: 'Ephesians 5:15–16',
    closingPrayer:
      'God, teach us to use our days wisely. Help us recognize your purposes and make room for responsibility, rest, and love. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'teens-integrity-unseen',
    title: 'Integrity When Nobody Is Watching',
    ageGroup: 'teens',
    sequenceNumber: 11,
    mainScriptureReference: 'Proverbs 10:9',
    scriptureReferences: ['Proverbs 10:9'],
    learningObjectives: [
      'Explain the proverb’s contrast between walking in integrity and crooked ways.',
      'Apply integrity to schoolwork, money, and digital choices.',
      'Identify a safe way to admit and repair a dishonest choice.',
    ],
    introduction:
      'It can seem easy to take a shortcut when no one is watching: copying work, hiding a mistake, or presenting someone else’s idea as your own. Proverbs 10:9 links integrity with security.',
    teachingPoints: [
      {
        title: 'Integrity describes a whole way of life',
        studentContent:
          'The proverb says the one who walks in integrity walks securely. The image suggests consistency between what a person claims and how they act.',
      },
      {
        title: 'Crookedness eventually becomes visible',
        studentContent:
          'The second line says the one who makes their ways crooked will be found out. Dishonesty creates vulnerability because it must be concealed and can harm trust.',
      },
      {
        title: 'Integrity is more than avoiding detection',
        studentContent:
          'The proverb praises a reliable path, not a clever way to escape consequences. Integrity matters even when discovery seems unlikely.',
      },
    ],
    practicalApplication:
      'Choose one area where honesty is hard. Correct the record, acknowledge your part, and ask a trusted adult how to make things right if the consequences feel serious.',
    discussionQuestions: [
      'What is the difference between integrity and simply not getting caught?',
      'How can honesty protect trust in a friendship or team?',
      'What makes admitting a mistake difficult, and what support helps?',
    ],
    memoryVerseReference: 'Proverbs 10:9',
    closingPrayer:
      'God, make us people of integrity in public and private. Give us courage to tell the truth and repair what we have damaged. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'teens-serving-others',
    title: 'Serving Others',
    ageGroup: 'teens',
    sequenceNumber: 12,
    mainScriptureReference: 'Mark 10:42–45',
    scriptureReferences: ['Mark 10:42–45'],
    learningObjectives: [
      'Explain how Jesus contrasts his community with rulers who dominate others.',
      'Describe Jesus’ teaching about becoming a servant.',
      'Distinguish freely chosen service from exploitation or coercion.',
    ],
    introduction:
      'James and John have asked for places of honor. The other disciples become indignant, and Jesus uses the moment to teach a different pattern of leadership.',
    teachingPoints: [
      {
        title: 'Jesus names domination as a worldly pattern',
        studentContent:
          'Jesus says rulers of the Gentiles lord it over people and exercise authority over them. He describes power used to control and elevate oneself.',
      },
      {
        title: 'Greatness is redefined as service',
        studentContent:
          'Jesus tells his followers that whoever wants to become great must be a servant, and whoever wants to be first must be slave of all. Service is not a way to secretly gain status; it reverses self-centered ambition.',
      },
      {
        title: 'Jesus gives his own life',
        studentContent:
          'The Son of Man came not to be served but to serve and give his life as a ransom for many. Jesus grounds the teaching in his mission, not in forced labor from vulnerable people.',
      },
    ],
    practicalApplication:
      'Choose a helpful task that meets a real need without seeking applause. Healthy service is voluntary and bounded; tell a trusted adult if someone is coercing, exploiting, or endangering you.',
    discussionQuestions: [
      'What kind of leadership does Jesus criticize?',
      'How is serving different from doing something only to gain popularity?',
      'What boundary helps make service healthy and voluntary?',
    ],
    memoryVerseReference: 'Mark 10:45',
    closingPrayer:
      'Jesus, teach us to serve as you served. Help us use influence for others’ good and recognize when a boundary or help is needed. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'adults-understanding-gods-character',
    title: 'Understanding God’s Character',
    ageGroup: 'adults',
    sequenceNumber: 1,
    mainScriptureReference: 'Exodus 34:5–7',
    scriptureReferences: ['Exodus 34:5–7'],
    learningObjectives: [
      'Identify the attributes God proclaims in the passage.',
      'Hold together the text’s language about mercy, justice, and accountability.',
      'Reflect on how God’s character should shape personal and communal conduct.',
    ],
    introduction:
      'After Israel’s covenant failure with the golden calf, Moses returns to the Lord at Sinai with new tablets. In Exodus 34 God descends in the cloud and proclaims the divine name and character.',
    teachingPoints: [
      {
        title: 'The Lord is merciful and gracious',
        studentContent:
          'Verses 5–6 describe the Lord as compassionate, gracious, slow to anger, and abounding in steadfast love and faithfulness. These are God’s self-declared qualities in a moment of covenant renewal.',
      },
      {
        title: 'Mercy includes forgiveness',
        studentContent:
          'Verse 7 says God maintains love and forgives iniquity, rebellion, and sin. The text speaks of real wrongdoing rather than minimizing it.',
      },
      {
        title: 'Compassion does not erase accountability',
        studentContent:
          'The same verse says God does not simply leave the guilty unpunished and describes consequences across generations. Read together, the lines hold mercy and moral seriousness in tension; they are not a license for people to claim divine authority to punish others.',
      },
    ],
    practicalApplication:
      'In a conflict, practise compassion without denial: name harm truthfully, seek repair, and preserve accountability. Resist using “grace” to silence those who have been harmed.',
    discussionQuestions: [
      'Which attributes does God proclaim in verses 6–7?',
      'Why is it important to read forgiveness and accountability together?',
      'How can a community show mercy while still addressing harm responsibly?',
    ],
    memoryVerseReference: 'Exodus 34:6',
    closingPrayer:
      'Lord, teach us your compassion, patience, faithfulness, and justice. Help us extend mercy without denying truth or protecting wrongdoing. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'adults-growing-through-scripture',
    title: 'Growing Through Scripture',
    ageGroup: 'adults',
    sequenceNumber: 2,
    mainScriptureReference: '2 Timothy 3:14–17',
    scriptureReferences: ['2 Timothy 3:14–17'],
    learningObjectives: [
      'Explain the passage’s description of Scripture’s role.',
      'Connect teaching, correction, and training with formation for good work.',
      'Adopt a careful practice of reading context before applying a text.',
    ],
    introduction:
      'The letter urges Timothy to remain in what he has learned, remembering those from whom he learned it. It refers to the sacred writings Timothy knew from childhood and describes their purpose.',
    teachingPoints: [
      {
        title: 'Remain grounded in what has been learned',
        studentContent:
          'Verses 14–15 connect Timothy’s knowledge with trusted teachers and the sacred writings. The text values learning within a community of faithful transmission.',
      },
      {
        title: 'Scripture is useful for formation',
        studentContent:
          'Verse 16 names teaching, reproof, correction, and training in righteousness. Scripture both instructs and challenges the reader; it is not merely a source of slogans.',
      },
      {
        title: 'The aim is readiness for good work',
        studentContent:
          'Verse 17 says the person of God may be complete and equipped for every good work. Interpretation should therefore form faithful practice, not pride or manipulation.',
      },
    ],
    practicalApplication:
      'Choose a short passage, identify its speaker, audience, and context, note what it teaches or corrects, and name one action that fits its purpose. Compare interpretations with trusted, responsible readers.',
    discussionQuestions: [
      'What practices does the passage say Scripture supports?',
      'How can correction be received without defensiveness?',
      'What good work might a careful reading equip you to do?',
    ],
    memoryVerseReference: '2 Timothy 3:16–17',
    closingPrayer:
      'God, form us through Scripture. Give us humility to learn, courage to be corrected, and readiness to do good. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'adults-consistent-prayer-life',
    title: 'Developing a Consistent Prayer Life',
    ageGroup: 'adults',
    sequenceNumber: 3,
    mainScriptureReference: 'Luke 11:1–13',
    scriptureReferences: ['Luke 11:1–13'],
    learningObjectives: [
      'Identify the petitions in the prayer Jesus teaches.',
      'Explain how the neighbor parable and father-child image encourage persistence and trust.',
      'Develop a sustainable prayer rhythm that includes dependence and God’s purposes.',
    ],
    introduction:
      'After Jesus prays, one disciple asks him to teach them to pray. Jesus gives a model prayer, a parable about a midnight request, and an assurance about the Father’s generosity.',
    teachingPoints: [
      {
        title: 'Prayer begins with God’s name and kingdom',
        studentContent:
          'The prayer addresses the Father, asks that God’s name be hallowed, and asks for the kingdom to come. Personal needs are set within God’s purposes.',
      },
      {
        title: 'Daily dependence includes bread and forgiveness',
        studentContent:
          'Jesus teaches requests for daily bread, forgiveness, and protection in testing. The prayer links receiving forgiveness with forgiving others.',
      },
      {
        title: 'Persistence rests in the Father’s goodness',
        studentContent:
          'The midnight neighbor story emphasizes persistent asking. Jesus then compares imperfect human parents with the Father, who gives the Holy Spirit to those who ask. Prayer is trust, not a technique to control outcomes.',
      },
    ],
    practicalApplication:
      'Choose a realistic time and a short pattern: praise, God’s purposes, needs, confession and forgiveness, and guidance. Keep a brief list and revisit it without treating unanswered requests as personal failure.',
    discussionQuestions: [
      'What is the order of concerns in the prayer Jesus gives?',
      'What does the neighbor story teach about persistence?',
      'How can a prayer rhythm remain steady without becoming a performance?',
    ],
    memoryVerseReference: 'Luke 11:9–10',
    closingPrayer:
      'Father, hallow your name and bring your kingdom. Give what we need, forgive us, guide us, and form us by your Spirit. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'adults-faith-difficult-seasons',
    title: 'Faith During Difficult Seasons',
    ageGroup: 'adults',
    sequenceNumber: 4,
    mainScriptureReference: 'James 1:2–8',
    scriptureReferences: ['James 1:2–8'],
    learningObjectives: [
      'Trace James’ movement from trials to endurance and maturity.',
      'Understand the invitation to ask God for wisdom.',
      'Respond to hardship with honest lament, wise support, and faithful action.',
    ],
    introduction:
      'James writes to believers scattered among the nations and speaks directly about trials. The passage neither denies suffering nor calls hardship pleasant in itself.',
    teachingPoints: [
      {
        title: 'Trials test faith and develop endurance',
        studentContent:
          'Verses 2–3 say the testing of faith produces perseverance. James invites a perspective of joy because of what endurance can form, not because pain is unreal.',
      },
      {
        title: 'Endurance is meant to complete its work',
        studentContent:
          'Verse 4 urges perseverance to finish its work so believers may be mature and complete. Growth is a process rather than a demand for instant strength.',
      },
      {
        title: 'Ask God for wisdom in the trial',
        studentContent:
          'Verses 5–8 invite anyone lacking wisdom to ask God, who gives generously. The passage warns against divided allegiance; it does not shame people for grief, questions, or seeking professional help.',
      },
    ],
    practicalApplication:
      'Name the difficulty honestly, ask God for wisdom, and identify one practical support: a trusted friend, pastor, clinician, or community resource. Avoid telling suffering people that they simply lack faith.',
    discussionQuestions: [
      'What does James say testing can produce?',
      'What might wisdom look like in a hardship that cannot be quickly changed?',
      'How can a faith community support someone without minimizing their pain?',
    ],
    memoryVerseReference: 'James 1:5',
    closingPrayer:
      'God, meet us in difficult seasons. Give wisdom generously, sustain endurance, and help us support one another with compassion. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'adults-forgiveness-reconciliation',
    title: 'Forgiveness and Reconciliation',
    ageGroup: 'adults',
    sequenceNumber: 5,
    mainScriptureReference: 'Colossians 3:12–14',
    scriptureReferences: ['Colossians 3:12–14'],
    learningObjectives: [
      'Identify the virtues the passage calls the community to put on.',
      'Explain the grounding and pattern of forgiveness in Christ.',
      'Distinguish forgiveness from bypassing accountability or safety.',
    ],
    introduction:
      'Colossians 3 describes the new life of a community chosen and loved by God. The instruction about forgiveness sits among compassion, kindness, humility, gentleness, patience, and love.',
    teachingPoints: [
      {
        title: 'The community is called to compassion',
        studentContent:
          'Verse 12 names compassion, kindness, humility, gentleness, and patience as clothing for God’s people. These are communal practices, not private sentiments alone.',
      },
      {
        title: 'Bear with one another and forgive',
        studentContent:
          'Verse 13 addresses grievances and tells believers to forgive as the Lord forgave them. Forgiveness acknowledges that a real grievance exists and calls the community away from retaliation.',
      },
      {
        title: 'Love binds the virtues together',
        studentContent:
          'Verse 14 calls love the bond of perfection or completeness. Reconciliation may require truth, repair, changed behavior, and safety; the passage does not require returning to an abusive or dangerous relationship.',
      },
    ],
    practicalApplication:
      'Where safe, identify the harm, communicate a clear boundary, and consider what repair is possible. In abuse or coercion, prioritize protection, seek qualified support, and do not pressure a harmed person into contact.',
    discussionQuestions: [
      'Which virtues surround the instruction to forgive?',
      'What does “as the Lord forgave you” contribute to the passage?',
      'What conditions are necessary for reconciliation to be safe and truthful?',
    ],
    memoryVerseReference: 'Colossians 3:13–14',
    closingPrayer:
      'Lord, clothe us with compassion and patience. Teach us forgiveness shaped by your mercy, joined with truth, repair, and protection of the vulnerable. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'adults-stewardship-responsibility',
    title: 'Stewardship and Responsibility',
    ageGroup: 'adults',
    sequenceNumber: 6,
    mainScriptureReference: 'Luke 16:10–13',
    scriptureReferences: ['Luke 16:10–13'],
    learningObjectives: [
      'Read Jesus’ teaching about faithfulness in small and great matters.',
      'Explain why money and service are matters of allegiance in the passage.',
      'Apply stewardship through transparent, responsible use of resources.',
    ],
    introduction:
      'Luke 16 follows the parable of the shrewd manager. Jesus turns to his disciples and speaks about trustworthiness, entrusted wealth, and the impossibility of serving both God and money.',
    teachingPoints: [
      {
        title: 'Faithfulness is consistent across scale',
        studentContent:
          'Jesus says whoever is faithful in little is faithful also in much, and whoever is dishonest in little is dishonest in much. Small choices reveal habits of trust.',
      },
      {
        title: 'Resources are entrusted, not absolute masters',
        studentContent:
          'Verses 11–12 ask whether a person can be trusted with true riches if unfaithful with worldly wealth. The passage challenges how disciples handle what is entrusted to them.',
      },
      {
        title: 'Money competes for service',
        studentContent:
          'Verse 13 says no servant can serve two masters and names God and money. Jesus presents money as a possible rival for ultimate loyalty, not merely a neutral tool.',
      },
    ],
    practicalApplication:
      'Review one financial or organizational responsibility for honesty, transparency, and care for people affected by it. Seek independent advice when decisions involve debt, exploitation, or complex obligations.',
    discussionQuestions: [
      'What does faithfulness in a small matter reveal?',
      'How can money become a master rather than a tool?',
      'What safeguards support trustworthy stewardship in an organization?',
    ],
    memoryVerseReference: 'Luke 16:10',
    closingPrayer:
      'God, teach us to handle resources faithfully. Free us from serving money and help us use what is entrusted to us for good. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'adults-christian-relationships',
    title: 'Christian Relationships',
    ageGroup: 'adults',
    sequenceNumber: 7,
    mainScriptureReference: 'Romans 12:9–18',
    scriptureReferences: ['Romans 12:9–18'],
    learningObjectives: [
      'Identify the practices Paul names for life in the Christian community.',
      'Explain how sincere love includes both honor and moral discernment.',
      'Choose one concrete action that promotes peace without denying justice.',
    ],
    introduction:
      'After describing the church as one body with many members and gifts, Paul gives a series of practical instructions for communal life.',
    teachingPoints: [
      {
        title: 'Love must be sincere',
        studentContent:
          'Paul calls for genuine love, hatred of evil, and holding fast to what is good. Christian relationship is not mere politeness; it has moral substance.',
      },
      {
        title: 'Honor and hospitality shape community',
        studentContent:
          'The passage calls believers to mutual affection, honoring one another, sharing with those in need, and practising hospitality. These habits counter competition and exclusion.',
      },
      {
        title: 'Peace is pursued as far as possible',
        studentContent:
          'Paul tells believers not to repay evil for evil, to leave room for God’s justice, and, if possible, so far as it depends on them, to live peaceably with all. Peace is pursued without claiming control over another person’s actions.',
      },
    ],
    practicalApplication:
      'Choose one relationship where you can honour, welcome, or help someone. Where harm continues, seek appropriate boundaries and accountability rather than using “peace” to silence the truth.',
    discussionQuestions: [
      'How does sincere love differ from simply avoiding disagreement?',
      'What does honouring another person look like in a tense relationship?',
      'What qualifications does Paul place on living peaceably with all?',
    ],
    memoryVerseReference: 'Romans 12:18',
    closingPrayer:
      'God, form sincere love among us. Help us honour one another, reject evil, welcome others, and seek peace with justice and wisdom. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'adults-integrity-daily-life',
    title: 'Integrity in Daily Life',
    ageGroup: 'adults',
    sequenceNumber: 8,
    mainScriptureReference: 'Micah 6:8',
    scriptureReferences: ['Micah 6:8'],
    learningObjectives: [
      'Read Micah 6:8 in the context of the people’s question about offerings.',
      'Explain justice, mercy, and humble walking with God as connected obligations.',
      'Identify a practical action addressing fairness in daily life.',
    ],
    introduction:
      'Micah 6 uses courtroom language: the Lord brings a case against the people, who ask what offerings they should bring. Verse 8 answers by pointing to a way of life.',
    teachingPoints: [
      {
        title: 'God has already made the requirement known',
        studentContent:
          'The prophet says God has shown what is good. The answer is not a more extravagant religious gift but faithful conduct.',
      },
      {
        title: 'Do justice',
        studentContent:
          'Justice means acting rightly in relationships and public life, not only feeling concern. Micah’s wider message confronts exploitation and corrupt leadership.',
      },
      {
        title: 'Love mercy and walk humbly with God',
        studentContent:
          'The verse joins steadfast love with justice and humble walking with God. Humility prevents people from claiming moral superiority while neglecting repair and care.',
      },
    ],
    practicalApplication:
      'Examine one decision involving work, family, money, or community power. Ask who bears the cost, whether the process is fair, and what humble repair or advocacy is possible.',
    discussionQuestions: [
      'What question about worship does Micah 6:8 answer?',
      'Why does the verse join justice, mercy, and humility?',
      'Where might a small act of justice matter in your community?',
    ],
    memoryVerseReference: 'Micah 6:8',
    closingPrayer:
      'God, show us what is good. Make us people who do justice, love mercy, and walk humbly with you. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'adults-serving-spiritual-gifts',
    title: 'Serving With Spiritual Gifts',
    ageGroup: 'adults',
    sequenceNumber: 9,
    mainScriptureReference: 'Romans 12:3–8',
    scriptureReferences: ['Romans 12:3–8'],
    learningObjectives: [
      'Explain Paul’s body metaphor and its challenge to individual pride.',
      'Identify the gifts listed in Romans 12:6–8.',
      'Plan service that is accountable, proportionate, and useful to others.',
    ],
    introduction:
      'Paul has urged believers to offer themselves to God and be transformed. He turns to gifts and describes the church as one body with many members.',
    teachingPoints: [
      {
        title: 'Think with sober judgment',
        studentContent:
          'Paul warns against thinking too highly of oneself and says each person should think with sober judgment according to the measure of faith God has given. Gifts are received, not proof of superiority.',
      },
      {
        title: 'One body needs many members',
        studentContent:
          'The members have different functions, but belong to one body. Difference is necessary for shared life; no single member is the whole community.',
      },
      {
        title: 'Use gifts faithfully for others',
        studentContent:
          'Paul lists prophecy, service, teaching, encouragement, giving, leadership, and mercy, each practised in a fitting way. These gifts serve the body and should be exercised with integrity.',
      },
    ],
    practicalApplication:
      'Ask trusted people where they see you contributing well, then try one appropriate service role with clear boundaries and accountability. A claimed gift never excuses control or harm.',
    discussionQuestions: [
      'Why does Paul connect gifts with sober judgment?',
      'What does the body image teach about dependence on one another?',
      'How can a community test whether a form of leadership is serving well?',
    ],
    memoryVerseReference: 'Romans 12:6',
    closingPrayer:
      'God, thank you for the gifts present in your people. Keep us humble, equip our service, and help each gift build up the whole community. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'adults-wisdom-decision-making',
    title: 'Wisdom in Decision-Making',
    ageGroup: 'adults',
    sequenceNumber: 10,
    mainScriptureReference: 'James 1:5',
    scriptureReferences: ['James 1:5'],
    learningObjectives: [
      'Read James 1:5 in its immediate context about trials and endurance.',
      'Describe the character of God as generous toward those who ask for wisdom.',
      'Combine prayer with evidence, counsel, and responsibility in a decision.',
    ],
    introduction:
      'James has just described trials and the formation of perseverance. In verse 5, he addresses the person who lacks wisdom and invites that person to ask God.',
    teachingPoints: [
      {
        title: 'Wisdom is needed in the middle of trials',
        studentContent:
          'The verse is connected to the preceding discussion of testing and maturity. The request is for wisdom to live faithfully, not necessarily for secret information about every future event.',
      },
      {
        title: 'God gives generously',
        studentContent:
          'James describes God as giving to all generously and without reproach. The invitation counters the fear that asking for wisdom will be met with contempt.',
      },
      {
        title: 'Ask in trust and act responsibly',
        studentContent:
          'The verse says wisdom will be given. In context, James also warns against divided allegiance. Trust does not remove the need to seek sound facts, counsel, and accountable action.',
      },
    ],
    practicalApplication:
      'Write down the decision, what is known, what remains uncertain, and who is affected. Pray for wisdom, consult people with relevant expertise, and choose a next step consistent with truth and care.',
    discussionQuestions: [
      'What kind of situation surrounds James’ invitation to ask for wisdom?',
      'What does “without reproach” suggest about God’s response?',
      'How can prayer and careful research work together?',
    ],
    memoryVerseReference: 'James 1:5',
    closingPrayer:
      'Generous God, give us wisdom for the decisions before us. Help us ask with trust, listen well, and act responsibly toward everyone affected. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'adults-compassion-needy',
    title: 'Compassion for Those in Need',
    ageGroup: 'adults',
    sequenceNumber: 11,
    mainScriptureReference: 'Matthew 25:31–40',
    scriptureReferences: ['Matthew 25:31–40'],
    learningObjectives: [
      'Summarize the King’s identification with people in need in the passage.',
      'Identify the concrete acts of care named by Jesus.',
      'Plan a respectful response that meets needs without humiliating recipients.',
    ],
    introduction:
      'In Matthew 25:31–46 Jesus describes the Son of Man judging the nations. Verses 31–40 picture the King separating people and explaining that acts toward “the least of these” were acts toward him.',
    teachingPoints: [
      {
        title: 'The King names concrete needs',
        studentContent:
          'The passage names hunger, thirst, being a stranger, lack of clothing, sickness, and imprisonment. Compassion is expressed through practical attention to people’s real circumstances.',
      },
      {
        title: 'The righteous are surprised',
        studentContent:
          'Those welcomed by the King ask when they saw him in need. They did not describe their acts as a strategy for earning status; the King identifies himself with those they served.',
      },
      {
        title: 'Care for the vulnerable matters to Jesus',
        studentContent:
          'The King says what was done for one of the least of these was done for him. The passage makes care for vulnerable people central to the judgment scene.',
      },
    ],
    practicalApplication:
      'Partner with a reputable local organization, listen to people’s expressed needs, protect privacy, and avoid making help conditional on religious participation or public gratitude.',
    discussionQuestions: [
      'Which needs are specifically named in the passage?',
      'Why are the righteous surprised by the King’s explanation?',
      'What safeguards make charitable help dignified and accountable?',
    ],
    memoryVerseReference: 'Matthew 25:40',
    closingPrayer:
      'Jesus, open our eyes to people in need. Teach us to offer practical, respectful care and to honor your image in every person. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
  originalLesson({
    id: 'adults-perseverance-in-faith',
    title: 'Perseverance in Faith',
    ageGroup: 'adults',
    sequenceNumber: 12,
    mainScriptureReference: 'Hebrews 12:1–3',
    scriptureReferences: ['Hebrews 12:1–3'],
    learningObjectives: [
      'Explain the race imagery and the role of witnesses in Hebrews 12.',
      'Identify what believers are told to lay aside and where to fix their attention.',
      'Develop a sustainable practice for continuing through discouragement.',
    ],
    introduction:
      'Hebrews 12 follows the account of faithful people in chapter 11. The author uses an athletic image to encourage a community facing weariness and opposition.',
    teachingPoints: [
      {
        title: 'A great cloud of witnesses surrounds the race',
        studentContent:
          'The witnesses of chapter 11 give testimony to faith. The image encourages the readers as they run the race set before them.',
      },
      {
        title: 'Lay aside hindrances and sin',
        studentContent:
          'The passage calls believers to throw off everything that hinders and the sin that entangles, and to run with perseverance. Some burdens require support and patience to address.',
      },
      {
        title: 'Fix attention on Jesus',
        studentContent:
          'Jesus is described as the pioneer and perfecter of faith, who endured the cross and hostility. Verse 3 tells readers to consider him so they will not grow weary or lose heart.',
      },
    ],
    practicalApplication:
      'Name one practice that strengthens faith and one avoidable burden that drains attention. Seek a realistic support plan with others; perseverance is not isolation or refusal to rest.',
    discussionQuestions: [
      'Who are the witnesses referred to by the previous chapter?',
      'What does the passage ask runners to lay aside?',
      'How can considering Jesus help without denying exhaustion or grief?',
    ],
    memoryVerseReference: 'Hebrews 12:1–2',
    closingPrayer:
      'Jesus, help us run with perseverance. Show us what to lay aside, give us companions for the journey, and renew us when we grow weary. Amen.',
    studentFacingContent: '',
    sections: [],
  }),
]
