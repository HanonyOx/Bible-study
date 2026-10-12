-- Generated from apps/web/src/features/sunday-school/originalSundaySchoolLessons.ts.
-- Imported records intentionally remain drafts until a trusted editorial workflow approves and publishes them.
begin;
insert into public.curriculum_editions (
  id, publisher, content_origin, name, year, edition_label, source_title, source_url,
  source_status, usage_rights_status, review_status, publication_status
) values (
  '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'Word & Way', 'original_word_and_way', 'Original Word & Way Bible Studies',
  2026, 'Original collection', 'Original Word & Way Bible study collection',
  null, 'not_applicable', 'not_applicable', 'not_reviewed', 'draft'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'b4f88a5f-ce79-5d8b-982c-24114788d30c', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'children',
  'God Creates the World', null, 1,
  'not_reviewed', 'draft', 'Invite learners to name something in nature they enjoy. Genesis begins by showing that the world is not an accident in the story: God creates, gives life, brings order, and calls creation good.',
  'Choose one act of care this week: keep a shared space clean, handle plants and animals gently, or include someone who is being left out.', 'Genesis 1:31',
  'Creator God, thank you for the good world you made. Help us care for it and treat every person with respect. Amen.', 'The Bible tells us that God made the world and everything in it. God called creation good and gave people the job of caring for it.',
  'Make a “care for creation” circle: each learner names one created thing and one gentle, practical way to care for it. Draw or act out one of the ideas.', 'God made a good world and asks us to care for it.'
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '5e24d5ac-baa1-5240-b80c-d72ff75406b1',
  'b4f88a5f-ce79-5d8b-982c-24114788d30c', 1, 'Genesis 1:1–31'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'f8c536d0-df22-547a-96fb-29b610931bf9',
  'b4f88a5f-ce79-5d8b-982c-24114788d30c', 1, 'Describe creation as God’s work and recognize that it is called good.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '89555549-7fd0-54d2-9d97-d4f0568d5c69',
  'b4f88a5f-ce79-5d8b-982c-24114788d30c', 2, 'Name ways people can care for the world and one another.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '46412963-ad29-5f3c-89b5-3d091c030aab',
  'b4f88a5f-ce79-5d8b-982c-24114788d30c', 3, 'Explain that every part of creation depends on God.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'adbf8572-68df-58d9-8838-55a8c0c0d293',
  'b4f88a5f-ce79-5d8b-982c-24114788d30c', 1, 'teaching_point', 'God is the beginning',
  'Genesis 1:1–2 presents God before the ordered world and describes the earth as unformed. God speaks and creation begins; the story gives God the initiative.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '0809e360-2a3e-59e7-98dd-364a0f226dd6',
  'b4f88a5f-ce79-5d8b-982c-24114788d30c', 2, 'teaching_point', 'God brings order and life',
  'Across the six days, God makes light, sky, land, plants, lights in the sky, living creatures, and human beings. Repeatedly, God sees that what is made is good.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'f7e69c85-b6b8-5edc-b597-be55bc0274dd',
  'b4f88a5f-ce79-5d8b-982c-24114788d30c', 3, 'teaching_point', 'People have a special responsibility',
  'In verses 26–31, human beings are made in God’s image and given responsibility within creation. Their role is care and stewardship, not permission to treat others or the earth carelessly.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '4c48463d-3df5-509c-b260-0fe2edb9f4b7', 'b4f88a5f-ce79-5d8b-982c-24114788d30c',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'c675c73a-3c73-5d45-bfe4-d2f000055037',
  '4c48463d-3df5-509c-b260-0fe2edb9f4b7', 1, 'What does the repeated phrase “God saw that it was good” tell us about creation?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '7c41aba8-468c-51a0-bb37-5c3939564e78',
  '4c48463d-3df5-509c-b260-0fe2edb9f4b7', 2, 'Which part of the creation account do you remember most clearly, and why?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '310ca3a2-695d-57e8-9a1e-00d008fe94dd',
  '4c48463d-3df5-509c-b260-0fe2edb9f4b7', 3, 'What is one practical way children can care for creation?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '6fc0c90b-479e-58d3-8621-1dbd8efa8844', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'children',
  'Noah Obeys God', null, 2,
  'not_reviewed', 'draft', 'Ask learners what makes a person trustworthy. Genesis 6 describes a violent and corrupt world, then focuses on Noah, who walked with God and listened to detailed instructions.',
  'When a trusted adult gives a safe and wise instruction, practise listening carefully and completing it. If an instruction feels unsafe, tell a trusted caregiver rather than keeping it secret.', 'Genesis 6:22',
  'God, help us listen to you and choose what is right. Give us patience to do good things faithfully. Amen.', 'Noah listened to God and carefully followed the instructions God gave him. The story teaches us to do what is right and to ask a trusted adult for help when we feel unsure.',
  'In small groups, build a simple paper or block structure from a short set of instructions. Discuss how careful listening and teamwork helped.', 'Listening carefully helps us follow through on what is right.'
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '46b76266-879c-5ddd-85aa-adcadd35c19f',
  '6fc0c90b-479e-58d3-8621-1dbd8efa8844', 1, 'Genesis 6:9–22'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '1795c02c-6520-5ddd-8ca5-75ec436814b4',
  '6fc0c90b-479e-58d3-8621-1dbd8efa8844', 1, 'Identify Noah as a person described as righteous in his generation.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '77e59a4c-db76-5a8e-bb9d-aa0f046526ec',
  '6fc0c90b-479e-58d3-8621-1dbd8efa8844', 2, 'Explain that Noah acted on God’s instructions.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '8080e6ff-d5f0-53f8-a0f1-4ba54530c2e4',
  '6fc0c90b-479e-58d3-8621-1dbd8efa8844', 3, 'Name a safe, wise action a child can take when asked to do what is right.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '93261ff2-d538-5e6e-83b3-951aa9800681',
  '6fc0c90b-479e-58d3-8621-1dbd8efa8844', 1, 'teaching_point', 'Noah’s character stood out',
  'Verses 9–10 describe Noah as righteous, blameless among his contemporaries, and walking with God. The passage contrasts his life with the violence around him.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'fdb53dbe-a793-5f62-a09e-f4844e204590',
  '6fc0c90b-479e-58d3-8621-1dbd8efa8844', 2, 'teaching_point', 'God gave Noah a difficult task',
  'God told Noah to build an ark and gave its dimensions and construction details. The work would have required time, effort, and trust.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '3c4cee27-8b9a-537b-8945-30b60c860cb5',
  '6fc0c90b-479e-58d3-8621-1dbd8efa8844', 3, 'teaching_point', 'Noah followed the instructions',
  'The account says Noah did all that God commanded. Obedience here is concrete action in response to God, not merely saying that he agreed.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '57933cfd-6746-5b3b-9938-cdbe3fcb813b', '6fc0c90b-479e-58d3-8621-1dbd8efa8844',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '86d9cb8b-b528-52e1-aa8b-6eaa28867ed5',
  '57933cfd-6746-5b3b-9938-cdbe3fcb813b', 1, 'What words does the passage use to describe Noah?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '9394b3c6-7fb4-5df2-aa8f-3d4db7a0ec90',
  '57933cfd-6746-5b3b-9938-cdbe3fcb813b', 2, 'Why might building the ark have required patience?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '102118cc-18bc-508f-9bed-cbeb957d6cfa',
  '57933cfd-6746-5b3b-9938-cdbe3fcb813b', 3, 'How can you tell a trusted adult when you are unsure about an instruction?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '0afa6f9e-c158-5578-a282-8e440539d230', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'children',
  'Joseph Chooses Forgiveness', null, 3,
  'not_reviewed', 'draft', 'Remind learners that Joseph’s brothers had sold him, and years later he became a leader in Egypt. In Genesis 45 the brothers meet him again during a famine, but they do not yet know who he is.',
  'If someone has hurt you, talk with a safe, trusted adult. Forgiveness can be a process; it does not require staying in danger, hiding harm, or immediately trusting someone again.', 'Genesis 45:5',
  'God, help us bring hurt to trusted people and learn to forgive wisely. Thank you that you can bring help and hope even after wrong choices. Amen.', 'Joseph’s brothers had hurt him. When they met again, Joseph chose to help his family during a terrible famine. Forgiving does not mean hurt was okay or that we must hide danger.',
  'Use two paper cards labelled “hurt” and “help.” Learners name safe ways to seek help after being hurt and kind actions that can begin repair, without sharing private experiences.', 'We can seek help and choose forgiveness without hiding harm.'
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '83a8180f-0836-5ce2-829b-d83597970ae7',
  '0afa6f9e-c158-5578-a282-8e440539d230', 1, 'Genesis 45:1–15'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'e6776547-79a7-50c2-a827-db0b83a8e8a4',
  '0afa6f9e-c158-5578-a282-8e440539d230', 1, 'Retell how Joseph revealed himself to his brothers.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'faf12e45-7f42-5b8b-9f31-b1cf841fed54',
  '0afa6f9e-c158-5578-a282-8e440539d230', 2, 'Recognize Joseph’s care for his family after their past harm.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '9b767bd6-4c2a-5154-9448-1071ac5e0cf9',
  '0afa6f9e-c158-5578-a282-8e440539d230', 3, 'Understand that forgiveness does not mean pretending hurtful actions were good.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '6dbfcdae-be44-56dc-aacb-467d5c71f101',
  '0afa6f9e-c158-5578-a282-8e440539d230', 1, 'teaching_point', 'Joseph tells the truth about who he is',
  'Joseph weeps and says, “I am Joseph.” His brothers are frightened. The passage does not hide the pain or shock of this family reunion.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'c65bfc3e-26e8-5372-9b78-566e15b6ab28',
  '0afa6f9e-c158-5578-a282-8e440539d230', 2, 'teaching_point', 'Joseph sees God’s care in the crisis',
  'In verses 5–8 Joseph says God sent him ahead to preserve life during the famine. He does not call the brothers’ earlier wrongdoing good; he describes how God worked to save lives despite it.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '0351ad57-8474-5d8a-9eaf-74a11d95098f',
  '0afa6f9e-c158-5578-a282-8e440539d230', 3, 'teaching_point', 'Joseph offers practical care',
  'Joseph tells his brothers to bring their father and household to Egypt, where they can survive the remaining famine. His response includes concrete help and renewed relationship.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'bb8f0547-c67d-5d67-8b95-8f42a4c4053d', '0afa6f9e-c158-5578-a282-8e440539d230',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '0bf0f13b-8034-556c-a4f7-c47cdac89eb0',
  'bb8f0547-c67d-5d67-8b95-8f42a4c4053d', 1, 'How do Joseph’s brothers react when he identifies himself?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '4b88ffd7-742a-5106-a246-4d83174f4964',
  'bb8f0547-c67d-5d67-8b95-8f42a4c4053d', 2, 'What does Joseph say about God’s purpose during the famine?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'ed76c783-6df4-5b85-b5d5-3d6f6c9f0a7e',
  'bb8f0547-c67d-5d67-8b95-8f42a4c4053d', 3, 'What is the difference between forgiving someone and saying their harmful choice was okay?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'c0a5c2c6-ab9c-51d3-88a1-25763e18f033', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'children',
  'Moses Is Called by God', null, 4,
  'not_reviewed', 'draft', 'Ask what it feels like to be asked to do something difficult. Moses was tending sheep when an unusual sight stopped him, and God spoke to him about the suffering of the Israelites in Egypt.',
  'When a child notices someone being excluded or treated unfairly, they can tell a trusted adult and offer safe kindness rather than trying to solve a dangerous situation alone.', 'Exodus 3:12',
  'God, thank you for seeing people who are hurting. Help us do kind and safe things, and remind us that you are with us. Amen.', 'God saw that the Israelites were suffering and called Moses to help lead them to freedom. Moses was worried, but God promised to be with him.',
  'Act out the scene in pairs: one learner is Moses noticing the bush, another narrates what God sees and promises. Keep the focus on listening and God’s promise.', 'God sees suffering and stays with those he calls to help.'
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  'f57f72bf-3f72-5067-8c71-34e4e7210b6b',
  'c0a5c2c6-ab9c-51d3-88a1-25763e18f033', 1, 'Exodus 3:1–12'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'c17017cf-f1e2-591b-bbf9-2dbbe5f81363',
  'c0a5c2c6-ab9c-51d3-88a1-25763e18f033', 1, 'Describe what Moses saw at Horeb.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '85202ca4-2ecb-53a5-ae93-c5e5abbe54b0',
  'c0a5c2c6-ab9c-51d3-88a1-25763e18f033', 2, 'Explain the mission God gave Moses to lead Israel out of Egypt.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'b464dfe2-470f-5907-a1ea-7ae9dacd68e4',
  'c0a5c2c6-ab9c-51d3-88a1-25763e18f033', 3, 'Remember God’s promise to be with Moses.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '835ee0af-00b3-5872-a613-37d95eee29b7',
  'c0a5c2c6-ab9c-51d3-88a1-25763e18f033', 1, 'teaching_point', 'God gets Moses’ attention',
  'Moses sees a bush burning without being consumed and turns aside to look. God calls Moses by name, and Moses answers.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'b1f6c944-828d-5cc2-8ba9-570a8a8b8d81',
  'c0a5c2c6-ab9c-51d3-88a1-25763e18f033', 2, 'teaching_point', 'God sees the people’s suffering',
  'God says that he has seen Israel’s affliction, heard their cries, and knows their suffering. God’s call is connected to liberation and care for an oppressed people.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'cd12cef1-a226-5079-9c92-2c473b3f6d1c',
  'c0a5c2c6-ab9c-51d3-88a1-25763e18f033', 3, 'teaching_point', 'God promises to be with Moses',
  'Moses feels small for the task, but God’s answer is, “I will be with you.” The passage grounds Moses’ mission in God’s presence, not Moses’ confidence alone.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'ff2f7a4c-8ccb-54a4-a6b8-b6bb3a9e99cc', 'c0a5c2c6-ab9c-51d3-88a1-25763e18f033',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'cb729963-c86c-5795-9239-9132af165584',
  'ff2f7a4c-8ccb-54a4-a6b8-b6bb3a9e99cc', 1, 'What made Moses turn aside to look at the bush?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '63f71776-d4bc-5f7f-b42b-626d4bbab777',
  'ff2f7a4c-8ccb-54a4-a6b8-b6bb3a9e99cc', 2, 'What did God say he had seen and heard?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '6d10e77c-a8cb-52f5-ae48-ebadaf920d34',
  'ff2f7a4c-8ccb-54a4-a6b8-b6bb3a9e99cc', 3, 'What promise did God give Moses when he felt unable?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '268a53a3-5073-5b55-9489-1caf67f2b438', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'children',
  'David Faces Goliath', null, 5,
  'not_reviewed', 'draft', 'The Israelite army is afraid of Goliath. David, a young shepherd, tells Saul that he will go. Ask learners whether courage always means feeling unafraid.',
  'When facing a hard but safe task, remember help you have received, prepare with the skills you have, and ask a trusted person to support you.', '1 Samuel 17:47',
  'God, thank you for being faithful. Give us courage to do what is right, wisdom to prepare, and humility to trust you. Amen.', 'David was afraid of no challenge because he remembered God’s help. He used what he knew and trusted God instead of pretending to be someone else.',
  'Make a “courage toolkit” card with three words: remember, prepare, ask. Learners add one safe example of each for a school or home challenge.', 'Courage remembers God’s help and takes a faithful next step.'
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '548105eb-8368-5c0a-8ae8-92ddaae02308',
  '268a53a3-5073-5b55-9489-1caf67f2b438', 1, '1 Samuel 17:32–50'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'd2dc99c0-355f-5be3-bbb0-68dd85bb82d1',
  '268a53a3-5073-5b55-9489-1caf67f2b438', 1, 'Explain why David trusted God when he faced Goliath.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'cfa8f1d2-d966-52b4-92cf-ee686a0262f7',
  '268a53a3-5073-5b55-9489-1caf67f2b438', 2, 'Notice that David refused armor that did not fit him.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '07ce5053-5056-5698-8161-81bace6b3e6b',
  '268a53a3-5073-5b55-9489-1caf67f2b438', 3, 'Identify courage as trusting God and taking a wise next step.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '7090bf70-5ffe-539e-b3a4-003597ac6d39',
  '268a53a3-5073-5b55-9489-1caf67f2b438', 1, 'teaching_point', 'David remembers God’s past help',
  'David tells Saul how God helped him protect sheep from a lion and a bear. He sees the present danger in light of God’s faithfulness.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'ef4679af-bb37-5fb2-ad61-e620f029982f',
  '268a53a3-5073-5b55-9489-1caf67f2b438', 2, 'teaching_point', 'David refuses what does not fit',
  'Saul puts his armor on David, but David cannot move comfortably in it. He takes it off and chooses his familiar staff, sling, and stones.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '1a216d6a-0bdf-5715-b797-b5e943c49fc6',
  '268a53a3-5073-5b55-9489-1caf67f2b438', 3, 'teaching_point', 'David names the source of victory',
  'David says the battle belongs to the Lord and that the Lord does not save by sword or spear. He runs toward the challenge trusting God, rather than boasting in weapons.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '7ff51092-8661-52a2-a359-64938909d1b3', '268a53a3-5073-5b55-9489-1caf67f2b438',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'de8c7de9-d298-5b05-9909-18abc6533f2f',
  '7ff51092-8661-52a2-a359-64938909d1b3', 1, 'What experiences did David remember when he spoke to Saul?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '1e831dd1-2b38-5de4-8a31-95242f4dc94f',
  '7ff51092-8661-52a2-a359-64938909d1b3', 2, 'Why did David take off Saul’s armor?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '7fd50c3b-f1ab-5766-a5d9-aef104fdfbd5',
  '7ff51092-8661-52a2-a359-64938909d1b3', 3, 'What does David say is more important than a sword or spear?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'd6bf59b8-85d0-5aad-81c1-642c31dc95c1', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'children',
  'Daniel Remains Faithful', null, 6,
  'not_reviewed', 'draft', 'Daniel served under a new king and was trusted because he was dependable. Some officials became jealous and used a law against prayer to target him.',
  'Build a simple habit of prayer and honesty. If a rule or peer pressure asks you to hurt someone or do something unsafe, talk to a trusted adult immediately.', 'Daniel 6:10',
  'God, help us be honest and faithful in everyday choices. Give us courage and bring us help when we face danger. Amen.', 'Daniel kept praying to God even when a new law tried to stop him. God protected Daniel, and Daniel continued to trust God.',
  'Create a weekly “quiet moment” wheel. Learners choose one short, realistic time for prayer or reflection and draw a reminder symbol.', 'A steady relationship with God helps us remain faithful.'
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '69dad68b-a6af-51a7-9f46-0b884a25f9e1',
  'd6bf59b8-85d0-5aad-81c1-642c31dc95c1', 1, 'Daniel 6:1–23'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '24bcaa01-fc12-58ec-9d7b-463cc3a855db',
  'd6bf59b8-85d0-5aad-81c1-642c31dc95c1', 1, 'Describe Daniel’s reputation at work in the kingdom.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '8941c917-6f59-5448-b712-890f004b1837',
  'd6bf59b8-85d0-5aad-81c1-642c31dc95c1', 2, 'Explain the conflict created by the new law.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '3ec182a9-6607-5685-8488-4617b82bcb99',
  'd6bf59b8-85d0-5aad-81c1-642c31dc95c1', 3, 'Recognize Daniel’s steady prayer and God’s deliverance.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'd7691cbf-1d56-5720-8eff-31d49af09b28',
  'd6bf59b8-85d0-5aad-81c1-642c31dc95c1', 1, 'teaching_point', 'Daniel is trustworthy',
  'Verses 1–5 show that Daniel’s excellent work and faithfulness made his rivals jealous. They could find no corruption in his work, so they looked for a way to attack his devotion to God.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'a7f6ea49-5070-5521-a860-f423d37fd3c2',
  'd6bf59b8-85d0-5aad-81c1-642c31dc95c1', 2, 'teaching_point', 'Daniel continues his established prayer',
  'When the law is signed, Daniel continues to pray as he had done before. His prayer is not a sudden performance; it is part of his regular relationship with God.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '156fd137-288d-56f1-bfa4-e0348cf43c95',
  'd6bf59b8-85d0-5aad-81c1-642c31dc95c1', 3, 'teaching_point', 'God is with Daniel in danger',
  'Daniel is thrown into the lions’ den, and God shuts the lions’ mouths. The story credits God with deliverance and shows the king’s recognition of God’s power.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'b52e45cf-e0b2-5b14-b154-0f1ba77bf87d', 'd6bf59b8-85d0-5aad-81c1-642c31dc95c1',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'ef37ac18-ecab-5345-a33f-85dc2720c31f',
  'b52e45cf-e0b2-5b14-b154-0f1ba77bf87d', 1, 'What qualities made Daniel dependable?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '18ab8d11-ecee-5ca1-a94c-4ed2f673af5b',
  'b52e45cf-e0b2-5b14-b154-0f1ba77bf87d', 2, 'What did Daniel do after he learned about the new law?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '5961a17b-8de8-5278-ada3-ff8ac2719fbf',
  'b52e45cf-e0b2-5b14-b154-0f1ba77bf87d', 3, 'Who can you speak with if you feel pressured to do something unsafe?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'fe652c4a-cd4c-5f1c-bb1f-e8e6c2cd2979', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'children',
  'Jesus Welcomes Children', null, 7,
  'not_reviewed', 'draft', 'Imagine arriving somewhere and being told you are not important enough to come near. In Mark 10, people bring children to Jesus, but the disciples rebuke them.',
  'Welcome younger children into a group by learning their names, listening to them, and making room for their participation.', 'Mark 10:14',
  'Jesus, thank you for welcoming children. Help us welcome others and make sure nobody is pushed away. Amen.', 'Jesus told the disciples not to stop children from coming to him. He held the children and blessed them.',
  'Practise a welcome circle: learners take turns greeting a pretend newcomer by name and inviting them into a simple group activity.', 'Jesus welcomes children, and we should welcome one another.'
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '539957eb-0fc3-59ed-8d49-d9249e3ab4a6',
  'fe652c4a-cd4c-5f1c-bb1f-e8e6c2cd2979', 1, 'Mark 10:13–16'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'd34b4d46-a919-5f16-89ef-7ea816bc1767',
  'fe652c4a-cd4c-5f1c-bb1f-e8e6c2cd2979', 1, 'Retell how the disciples treated the people bringing children.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'f974c80e-3ed7-5b29-a23f-f1774f2c61e3',
  'fe652c4a-cd4c-5f1c-bb1f-e8e6c2cd2979', 2, 'Explain Jesus’ response to the disciples.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '36216dfe-445d-56cf-8138-862c70b53014',
  'fe652c4a-cd4c-5f1c-bb1f-e8e6c2cd2979', 3, 'Describe one way a group can welcome children.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'c3ba8f50-99eb-523b-ab61-4e462b2d6a1b',
  'fe652c4a-cd4c-5f1c-bb1f-e8e6c2cd2979', 1, 'teaching_point', 'The disciples try to keep children away',
  'People bring children for Jesus to touch them, and the disciples rebuke those bringing them. The passage shows how adults can wrongly put barriers between children and Jesus.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '63208057-96a4-57fc-897a-930819f6dd93',
  'fe652c4a-cd4c-5f1c-bb1f-e8e6c2cd2979', 2, 'teaching_point', 'Jesus says children should come',
  'Jesus is indignant and tells the disciples to let the children come and not hinder them. He says the kingdom of God belongs to such as these.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'b0247e3a-26c2-51fd-b54c-1d0fda94db69',
  'fe652c4a-cd4c-5f1c-bb1f-e8e6c2cd2979', 3, 'teaching_point', 'Jesus blesses the children',
  'Jesus takes the children in his arms, lays his hands on them, and blesses them. His welcome is personal and active.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'ef9b6286-b86e-532a-90dd-9abfe461176a', 'fe652c4a-cd4c-5f1c-bb1f-e8e6c2cd2979',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '587ddd3a-7a00-5a5c-9d2d-9ee112384406',
  'ef9b6286-b86e-532a-90dd-9abfe461176a', 1, 'What did the disciples do when people brought children?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '35410793-d36e-5be0-966f-85c555323b3d',
  'ef9b6286-b86e-532a-90dd-9abfe461176a', 2, 'How did Jesus respond to the disciples?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '03f4ffa1-6d5c-55c7-bb91-df88e5715060',
  'ef9b6286-b86e-532a-90dd-9abfe461176a', 3, 'What can you do so someone younger feels included?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '2ce73af0-91ed-5419-acd5-954894c38637', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'children',
  'The Good Samaritan', null, 8,
  'not_reviewed', 'draft', 'A law expert asks Jesus what he must do to inherit eternal life and later asks, “Who is my neighbor?” Jesus answers with a story about a wounded traveller.',
  'If someone is hurt or unsafe, get a responsible adult or emergency help. Children should not approach danger alone; kindness includes getting safe help.', 'Luke 10:37',
  'God, give us compassionate hearts. Help us notice people in need and find safe, practical ways to show mercy. Amen.', 'Jesus’ story shows a Samaritan caring for an injured stranger. A neighbor is someone we treat with mercy.',
  'Put picture cards of everyday needs in a bowl. Learners suggest a safe, age-appropriate response for each, including when to call an adult.', 'A neighbor shows mercy through practical care.'
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '842860aa-0d6d-5cb6-a174-7cb71682be0a',
  '2ce73af0-91ed-5419-acd5-954894c38637', 1, 'Luke 10:25–37'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'd87e6666-76e6-5a40-a0cb-9432fa20b606',
  '2ce73af0-91ed-5419-acd5-954894c38637', 1, 'Identify the actions of the Samaritan in Jesus’ story.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '0d5625f9-02f0-568d-89ed-824c84cf5c65',
  '2ce73af0-91ed-5419-acd5-954894c38637', 2, 'Explain how Jesus answers the question “Who is my neighbor?”'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'd5532959-7d8a-59fd-a62e-898c812550c9',
  '2ce73af0-91ed-5419-acd5-954894c38637', 3, 'Choose a safe way to show compassion to someone in need.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '115f1ef1-1932-580a-aff6-d78e2a7d2551',
  '2ce73af0-91ed-5419-acd5-954894c38637', 1, 'teaching_point', 'Two travellers pass by',
  'A priest and a Levite see the injured man and pass on the other side. Jesus does not give their reasons; the story emphasizes that they do not help.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '49989c68-b50c-5cf7-9f44-36bfa224e700',
  '2ce73af0-91ed-5419-acd5-954894c38637', 2, 'teaching_point', 'The Samaritan shows mercy',
  'The Samaritan sees the man, feels compassion, treats his wounds, and takes him to an inn. He gives time and resources for the man’s care.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'ad26f77b-a1d0-55ca-8ac9-791626b90169',
  '2ce73af0-91ed-5419-acd5-954894c38637', 3, 'teaching_point', 'Jesus calls the listener to act',
  'Jesus asks which traveller acted as a neighbor. The answer is the one who showed mercy. Jesus tells the questioner to go and do likewise.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '5d9f16c0-8a52-5662-95e6-0a45cda89fa5', '2ce73af0-91ed-5419-acd5-954894c38637',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'f7649699-24de-5b0b-9253-b8a00de67ff7',
  '5d9f16c0-8a52-5662-95e6-0a45cda89fa5', 1, 'What did the Samaritan do after seeing the injured man?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'bcb721f9-8c7b-562d-824e-98c8217e54d4',
  '5d9f16c0-8a52-5662-95e6-0a45cda89fa5', 2, 'How did Jesus answer the question about who was a neighbor?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '99bf85d4-b9a8-591d-ad08-d860bb2c065e',
  '5d9f16c0-8a52-5662-95e6-0a45cda89fa5', 3, 'What is a safe way to help a classmate who is struggling?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'a0f2a09c-dda5-5a5a-9d18-0fc508032e0e', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'children',
  'The Lost Sheep', null, 9,
  'not_reviewed', 'draft', 'Tax collectors and sinners were gathering to hear Jesus, while Pharisees and teachers complained that he welcomed them. Jesus responds with a parable about a shepherd and one lost sheep.',
  'Notice when someone is left out and invite them to join. If you feel lost or have done wrong, speak honestly with a trusted adult and remember that turning back is welcomed.', 'Luke 15:6–7',
  'God, thank you that you seek and welcome those who turn back to you. Help us welcome people with care and joy. Amen.', 'Jesus told a story about a shepherd who searched for one lost sheep and celebrated when he found it. Jesus said heaven rejoices when someone turns back to God.',
  'Hide a paper sheep in the room. One learner finds it while others give gentle directions, then the group discusses how it feels to be noticed and welcomed.', 'God cares about people who feel lost and rejoices when they return.'
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '4f2fd504-6935-5069-a68e-4701bbc01840',
  'a0f2a09c-dda5-5a5a-9d18-0fc508032e0e', 1, 'Luke 15:1–7'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '7bbb2d1a-1657-544a-80d7-1067493137a1',
  'a0f2a09c-dda5-5a5a-9d18-0fc508032e0e', 1, 'Explain why Jesus told the parable of the lost sheep.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '4dceaef9-8439-501e-bc96-52b57eb20bc4',
  'a0f2a09c-dda5-5a5a-9d18-0fc508032e0e', 2, 'Describe the shepherd’s response when one sheep is lost.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '6c527dc6-3705-55de-b19c-d732fb07e6d5',
  'a0f2a09c-dda5-5a5a-9d18-0fc508032e0e', 3, 'Recognize the joy Jesus describes when a sinner repents.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '5c07af48-bdac-53c5-8497-0759d669c8eb',
  'a0f2a09c-dda5-5a5a-9d18-0fc508032e0e', 1, 'teaching_point', 'The shepherd notices the one missing',
  'The shepherd has one hundred sheep and leaves the ninety-nine in the open country while searching for the lost one until he finds it. The story highlights the value of the one who is missing.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '6ee0fdd7-968e-5958-846d-c7c3667f9123',
  'a0f2a09c-dda5-5a5a-9d18-0fc508032e0e', 2, 'teaching_point', 'The shepherd carries the sheep home',
  'When he finds the sheep, he joyfully puts it on his shoulders and calls friends and neighbors to celebrate. The response is care and joy, not scolding.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'e389c748-3c0a-5ff5-9584-319e04625781',
  'a0f2a09c-dda5-5a5a-9d18-0fc508032e0e', 3, 'teaching_point', 'Heaven rejoices over repentance',
  'Jesus explains that there is joy in heaven over one sinner who repents. The parable answers criticism of Jesus’ welcome by showing God’s concern for the lost.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '44a8b281-2853-55c0-9365-6b79399e2efd', 'a0f2a09c-dda5-5a5a-9d18-0fc508032e0e',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'e7d373e6-e77e-5a7c-bb92-0b625757475f',
  '44a8b281-2853-55c0-9365-6b79399e2efd', 1, 'Why did Jesus tell this story?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '35004ef2-0a9d-58e7-9b96-b941c2d28b99',
  '44a8b281-2853-55c0-9365-6b79399e2efd', 2, 'What did the shepherd do when he found the sheep?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '4819a378-aba6-5b5f-9a2f-519af89bc938',
  '44a8b281-2853-55c0-9365-6b79399e2efd', 3, 'What does Jesus say brings joy in heaven?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '41a5b284-620a-5c87-a204-7fd2330cc41f', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'children',
  'Jesus Calms the Storm', null, 10,
  'not_reviewed', 'draft', 'Jesus and the disciples cross the lake after a day of teaching. Ask learners what helps them when something frightening happens.',
  'When you are afraid, tell a trusted adult what is happening, take slow breaths, and pray if that helps you. This story does not mean every frightening situation ends immediately, but it shows that we can bring fear to Jesus.', 'Mark 4:39',
  'Jesus, thank you that we can bring our fears to you. Help us seek wise help and remember your care. Amen.', 'A storm frightened the disciples while they were in a boat. Jesus stopped the wind and waves, and the disciples learned more about his authority.',
  'Use a paper boat and a bowl of water to gently make waves, then settle them. Learners name safe people and calming actions they can use when worried.', 'We can bring our fears to Jesus and ask trusted people for help.'
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '29b4f332-2d69-5213-a4cc-a481f0a4645d',
  '41a5b284-620a-5c87-a204-7fd2330cc41f', 1, 'Mark 4:35–41'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '717d291d-717a-5543-9d37-6efb015ed4d4',
  '41a5b284-620a-5c87-a204-7fd2330cc41f', 1, 'Retell what happened in the boat during the storm.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'e8078025-b72c-5560-b6dc-d4f952ed19fd',
  '41a5b284-620a-5c87-a204-7fd2330cc41f', 2, 'Describe how Jesus responded to the wind and waves.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '7dceae01-4dcb-5294-b240-f63b2aaf7f8f',
  '41a5b284-620a-5c87-a204-7fd2330cc41f', 3, 'Name a trusted person to seek when fear feels overwhelming.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '2a78db96-a9a2-547d-886e-5ab7a9693267',
  '41a5b284-620a-5c87-a204-7fd2330cc41f', 1, 'teaching_point', 'A dangerous storm rises',
  'Waves break over the boat until it is filling with water. Some disciples are experienced fishermen, yet they fear they will drown.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '12147378-d4e1-53f7-82d1-d6de305560e4',
  '41a5b284-620a-5c87-a204-7fd2330cc41f', 2, 'teaching_point', 'The disciples wake Jesus',
  'Jesus is asleep in the stern. The disciples wake him and ask whether he cares that they are perishing. They bring their fear honestly to him.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '40eebae0-20e3-5c42-a90a-8119a350db73',
  '41a5b284-620a-5c87-a204-7fd2330cc41f', 3, 'teaching_point', 'Jesus stills the storm and asks about faith',
  'Jesus rebukes the wind and tells the sea to be still. The storm ceases, and the disciples wonder who he is. The passage presents Jesus’ authority and also acknowledges the disciples’ fear.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '76287aa1-f758-5c0f-915b-ecb99cd4f5b0', '41a5b284-620a-5c87-a204-7fd2330cc41f',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '7ea8a4f5-3f57-5729-a9fe-fbac12e2f36a',
  '76287aa1-f758-5c0f-915b-ecb99cd4f5b0', 1, 'What did the disciples see happening to the boat?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'a53b00f3-1ae1-5b82-bef2-63289b8b1e4b',
  '76287aa1-f758-5c0f-915b-ecb99cd4f5b0', 2, 'What did they ask Jesus?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'f07ce843-1097-5793-8b14-03e11c1cf0a8',
  '76287aa1-f758-5c0f-915b-ecb99cd4f5b0', 3, 'Who can help you when you feel unsafe or very afraid?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '73147640-5ead-5906-bda9-76fdcc6ea893', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'children',
  'The Boy Who Shared His Food', null, 11,
  'not_reviewed', 'draft', 'A large crowd follows Jesus. Jesus asks Philip where bread can be bought, testing him; Andrew points out a boy with five barley loaves and two fish, while noting how small the amount seems.',
  'Sharing can mean food, time, attention, or a useful skill. Ask a caregiver or community leader how to share safely and respectfully, especially when meeting someone’s needs.', 'John 6:11',
  'Jesus, thank you for providing and teaching us not to waste. Help us share what we can with care. Amen.', 'A boy had five loaves and two fish. Jesus gave thanks, fed a huge crowd, and made sure the extra food was gathered.',
  'With counters or paper shapes, model a small supply being shared among a group, then collect the remaining pieces. Discuss what “enough” and “not wasting” mean.', 'Offer what you can and use gifts carefully.'
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '038a50a4-67f5-527c-b2e5-8c5b19b7905c',
  '73147640-5ead-5906-bda9-76fdcc6ea893', 1, 'John 6:1–13'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '0312212d-7f65-5e44-86cc-1d51a4d7ebe6',
  '73147640-5ead-5906-bda9-76fdcc6ea893', 1, 'Identify the food the boy had with him.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '58f69d5f-b3f8-58ee-a28d-aac959262f19',
  '73147640-5ead-5906-bda9-76fdcc6ea893', 2, 'Explain how Jesus involved the disciples in feeding the crowd.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '3c6548a5-40bd-5e04-b51d-e69aaebbd526',
  '73147640-5ead-5906-bda9-76fdcc6ea893', 3, 'Choose a realistic way to share or help others.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '1861c4d9-c67d-5ce2-bda0-9b80f1eb53ab',
  '73147640-5ead-5906-bda9-76fdcc6ea893', 1, 'teaching_point', 'The need is bigger than the visible supply',
  'About five thousand men are present. Philip calculates the cost, and Andrew sees the boy’s food but asks what it can do for so many.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'fbb2878b-35e6-56f8-9ec2-f51511bdae30',
  '73147640-5ead-5906-bda9-76fdcc6ea893', 2, 'teaching_point', 'Jesus gives thanks and distributes the food',
  'Jesus has the people sit down, takes the loaves, gives thanks, and distributes the food, along with the fish, as much as they want.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '16521c2d-b2e3-5390-8b83-cb0a6e2f1c32',
  '73147640-5ead-5906-bda9-76fdcc6ea893', 3, 'teaching_point', 'The leftovers are gathered carefully',
  'After everyone eats, Jesus tells the disciples to gather the leftovers so nothing is wasted. They fill twelve baskets with pieces from the five barley loaves.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'e7a468a9-043f-5b72-ac98-d0c9551db6dc', '73147640-5ead-5906-bda9-76fdcc6ea893',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '3135fcf9-89fb-504d-8b7c-051c283ca5ac',
  'e7a468a9-043f-5b72-ac98-d0c9551db6dc', 1, 'What food did the boy have?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'a44488ed-c39f-579f-8368-09645b482fed',
  'e7a468a9-043f-5b72-ac98-d0c9551db6dc', 2, 'What did Jesus do before the food was distributed?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '4f4ed296-e7d3-5b37-add3-cc613a413245',
  'e7a468a9-043f-5b72-ac98-d0c9551db6dc', 3, 'Why do you think Jesus told the disciples to gather the leftovers?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'af0efb1b-d035-50e8-99b7-28b920f16393', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'children',
  'The Early Church Shares', null, 12,
  'not_reviewed', 'draft', 'After Peter’s message at Pentecost, many people are baptized and become part of the community of believers. Acts describes what their new life together looked like.',
  'Contribute through a safe group activity: share supplies, help set up, or include a classmate. Ask a trusted adult before giving money or personal items.', 'Acts 2:44–45',
  'God, thank you for people who learn, pray, and care together. Show us how to share wisely and include others. Amen.', 'The first believers learned about Jesus, prayed, ate together, and shared so people in need received help.',
  'Plan a pretend class “helping table” using cards for time, skills, supplies, and care. Choose one supervised action the class could actually do.', 'A caring faith community learns together and shares wisely.'
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '46a600a3-e12d-5bb9-901a-66f7398d8bb6',
  'af0efb1b-d035-50e8-99b7-28b920f16393', 1, 'Acts 2:42–47'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '25b439f1-9fcf-548e-968d-29bf408d8835',
  'af0efb1b-d035-50e8-99b7-28b920f16393', 1, 'Name practices the early believers shared.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '7031fbcc-51f8-57fe-8328-e9b2dc5f77bd',
  'af0efb1b-d035-50e8-99b7-28b920f16393', 2, 'Explain how they responded when people had needs.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'f6466f37-fdb6-5151-bbe7-b1d17f41babe',
  'af0efb1b-d035-50e8-99b7-28b920f16393', 3, 'Identify a safe way to contribute to a caring community.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'd6c36009-58e8-53bc-a1e8-3dbc0598f0e5',
  'af0efb1b-d035-50e8-99b7-28b920f16393', 1, 'teaching_point', 'They learn and worship together',
  'The believers devote themselves to the apostles’ teaching, fellowship, breaking bread, and prayers. Their faith is practiced together, not only in private.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '06b52c9b-514a-5a18-8898-26f3123705e7',
  'af0efb1b-d035-50e8-99b7-28b920f16393', 2, 'teaching_point', 'They share with people in need',
  'The passage says they sold possessions and goods and distributed to anyone as they had need. Their generosity responded to real needs in the community.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '2adecf0e-7097-5d06-854f-fd92787e159a',
  'af0efb1b-d035-50e8-99b7-28b920f16393', 3, 'teaching_point', 'Their shared life is visible',
  'They meet in the temple and in homes, eat with glad and sincere hearts, praise God, and have goodwill among the people. The community’s life gives witness.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '38e14589-21b6-539e-81aa-688394042114', 'af0efb1b-d035-50e8-99b7-28b920f16393',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '16ed6533-126d-5e02-bf44-59d2b6114608',
  '38e14589-21b6-539e-81aa-688394042114', 1, 'What four things did the believers devote themselves to?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '0263d87c-6dcf-5d24-a977-d19ef01bea64',
  '38e14589-21b6-539e-81aa-688394042114', 2, 'How did the community respond to people’s needs?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'dd2c197f-d6cd-5b06-9f0e-3ec8edfc1805',
  '38e14589-21b6-539e-81aa-688394042114', 3, 'What can our group share safely this week?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '1c6f5639-a14e-531e-9b56-ccd326db9d84', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'teens',
  'Identity and Worth', null, 1,
  'not_reviewed', 'draft', 'Social media, grades, appearance, and peer approval can make worth feel conditional. Psalm 139 is a prayer that describes God’s intimate knowledge and the wonder of human life.',
  'When comparison becomes heavy, name one quality or relationship you value that is not based on appearance or achievement. If thoughts about your worth become distressing, talk with a trusted adult or counselor.', 'Psalm 139:14',
  'God, thank you that our lives are known to you. Help us resist harmful comparison and treat ourselves and others with dignity. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  'd609cae4-5d14-5e2d-881a-0c86164bcb1a',
  '1c6f5639-a14e-531e-9b56-ccd326db9d84', 1, 'Psalm 139:13–18'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'dca36f85-ff24-528c-bdf0-94c4136bd50c',
  '1c6f5639-a14e-531e-9b56-ccd326db9d84', 1, 'Explain the psalmist’s image of being formed and known by God.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '6013356a-dbbb-555d-811f-85a8415c17ae',
  '1c6f5639-a14e-531e-9b56-ccd326db9d84', 2, 'Distinguish God-given worth from popularity or performance.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '5bb43c9b-0ee8-5591-bb53-572439c6ce37',
  '1c6f5639-a14e-531e-9b56-ccd326db9d84', 3, 'Choose a supportive response to comparison or self-criticism.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '4289eed3-62fc-5ae8-a9df-498b4530566a',
  '1c6f5639-a14e-531e-9b56-ccd326db9d84', 1, 'teaching_point', 'The psalm describes God’s involvement in life',
  'Verses 13–15 use the image of God forming the speaker in the womb and seeing the hidden beginning of life. The poetry expresses reverence for God’s work, not a scorecard of achievement.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '4d75fe21-ef3b-5eae-a900-f816bf9bacf2',
  '1c6f5639-a14e-531e-9b56-ccd326db9d84', 2, 'teaching_point', 'The speaker is fully known',
  'Verse 16 says the speaker’s days were known to God. In the surrounding psalm, God’s knowledge is personal and comprehensive; the speaker is not invisible to God.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '675197cd-8eb3-5a9a-9127-061eaec0051e',
  '1c6f5639-a14e-531e-9b56-ccd326db9d84', 3, 'teaching_point', 'Wonder leads to reflection',
  'The psalmist calls God’s thoughts precious and beyond counting. The passage invites humility and awe rather than making popularity or performance the measure of a person.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'd0919f0a-62ea-5453-bad5-574c54bfed0a', '1c6f5639-a14e-531e-9b56-ccd326db9d84',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'b02f3e07-825e-5bbc-bf59-acdabbaf6bf0',
  'd0919f0a-62ea-5453-bad5-574c54bfed0a', 1, 'What images does the psalm use to describe God’s knowledge of the speaker?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'b7f35912-74e6-5862-a183-7500cf5fcce9',
  'd0919f0a-62ea-5453-bad5-574c54bfed0a', 2, 'How can online comparison distort a person’s sense of worth?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '88b7030a-e1f4-5ef7-8c09-134ba9e03a84',
  'd0919f0a-62ea-5453-bad5-574c54bfed0a', 3, 'Who is a safe person to approach when self-criticism feels overwhelming?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'c64e736b-b215-576e-8e5d-c24c0b63edbd', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'teens',
  'Choosing Wise Friends', null, 2,
  'not_reviewed', 'draft', 'A friend group can influence how someone speaks, spends time, handles conflict, and makes risky choices. Proverbs 13:20 is a compact wisdom saying about the company we keep.',
  'Think of one relationship that helps you make wise choices and invest in it. If a group pressures you toward harm, prepare a short boundary statement and seek support from a trusted adult.', 'Proverbs 13:20',
  'God, give us wisdom in our friendships. Help us encourage good choices, set healthy boundaries, and seek wise support. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  'aa5808e9-bfae-5a0d-a301-d05c15068056',
  'c64e736b-b215-576e-8e5d-c24c0b63edbd', 1, 'Proverbs 13:20'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '86e9260f-f9f8-59b2-8b86-adf45e0806e6',
  'c64e736b-b215-576e-8e5d-c24c0b63edbd', 1, 'Interpret the proverb’s contrast between walking with the wise and associating with fools.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'ca5d3f59-523b-54f4-92f6-88ff1bf60e04',
  'c64e736b-b215-576e-8e5d-c24c0b63edbd', 2, 'Identify how repeated relationships can shape habits and judgment.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'c4224351-9fcc-547b-a124-b12cc17d9cf6',
  'c64e736b-b215-576e-8e5d-c24c0b63edbd', 3, 'Practise setting a respectful boundary around harmful pressure.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '571efb12-f1e1-5c14-a635-d441d894aaa5',
  'c64e736b-b215-576e-8e5d-c24c0b63edbd', 1, 'teaching_point', '“Walking” suggests ongoing influence',
  'The proverb pictures companionship as walking together. Influence often forms through repeated choices and shared habits, not one dramatic moment.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'de2b9cfd-0763-5406-97a3-1c89bc699fbc',
  'c64e736b-b215-576e-8e5d-c24c0b63edbd', 2, 'teaching_point', 'Wisdom is learned in relationship',
  'The wise companion grows wiser. Proverbs treats wisdom as practical skill for living well, including listening, self-control, and reverence for God.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'd9f9430b-9b88-5992-9939-e9e6176be0bc',
  'c64e736b-b215-576e-8e5d-c24c0b63edbd', 3, 'teaching_point', 'Careless company carries consequences',
  'The second line warns that associating with fools leads to harm. It is a warning to consider influence, not a command to despise people or abandon someone who needs help.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '2c3f964d-ab34-5861-ab40-206b69fb4be7', 'c64e736b-b215-576e-8e5d-c24c0b63edbd',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'feef9f94-bb92-5a1e-b036-6d99aeeda4b5',
  '2c3f964d-ab34-5861-ab40-206b69fb4be7', 1, 'What might “walk with the wise” look like at school or online?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'c47970f3-0775-5c41-bc27-e4968b9fab87',
  '2c3f964d-ab34-5861-ab40-206b69fb4be7', 2, 'How can you recognize influence that is becoming harmful?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '9b02ab88-e2d6-5a75-b9d5-75adbb8ef6cc',
  '2c3f964d-ab34-5861-ab40-206b69fb4be7', 3, 'How can you care about someone without copying every choice they make?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'fab8980c-e316-536e-a6b4-340ecb96ada6', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'teens',
  'Handling Peer Pressure', null, 3,
  'not_reviewed', 'draft', 'Daniel and other young Judeans are taken to Babylon and placed in the king’s training program. Their situation is not simply a normal school choice: they are displaced under an imperial power.',
  'Before a pressured situation, decide your boundary, practise a calm refusal, and identify a safe adult or friend to contact. Do not try a health or diet experiment from this ancient narrative without qualified guidance.', 'Daniel 1:8',
  'God, help us hold to wise convictions with humility. Give us clear words, safe support, and practical wisdom under pressure. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  'dc856d7c-67e5-543c-af0b-ee72722567d7',
  'fab8980c-e316-536e-a6b4-340ecb96ada6', 1, 'Daniel 1:8–17'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '0b23b796-e6f4-5d25-bad4-d878bbf1d6ce',
  'fab8980c-e316-536e-a6b4-340ecb96ada6', 1, 'Describe Daniel’s concern about the royal food and his respectful request.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '61c18ee6-fca5-50f5-9c87-2d99e61d564d',
  'fab8980c-e316-536e-a6b4-340ecb96ada6', 2, 'Notice the role of preparation, conversation, and testing in the account.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'c959fb99-843f-502e-8bb2-c80c2cb2ae28',
  'fab8980c-e316-536e-a6b4-340ecb96ada6', 3, 'Plan a safe response to pressure that conflicts with conscience or wellbeing.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '0034aa63-0b81-54d3-ab40-b36ad10e1678',
  'fab8980c-e316-536e-a6b4-340ecb96ada6', 1, 'teaching_point', 'Daniel makes a considered decision',
  'Daniel resolves not to defile himself with the king’s food and wine. The text states his conviction but does not specify every reason behind it.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '55508ba4-4228-5a11-995c-a084b2fc8357',
  'fab8980c-e316-536e-a6b4-340ecb96ada6', 2, 'teaching_point', 'He speaks respectfully and proposes a test',
  'Daniel asks the chief official for permission. When the official fears consequences, Daniel proposes a ten-day test with vegetables and water, allowing the official to observe the outcome.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '62bbaca0-17e1-5d7d-83bd-a4daed652ec3',
  'fab8980c-e316-536e-a6b4-340ecb96ada6', 3, 'teaching_point', 'Faithfulness includes practical wisdom',
  'The account says God gave Daniel favor and knowledge, and that the young men appeared healthier after the test. Their faithfulness combines conviction, respectful speech, and an observable plan.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'cfd346cf-7973-576f-9a9a-154ae54efd32', 'fab8980c-e316-536e-a6b4-340ecb96ada6',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'c52b6e38-b740-58ab-84cb-f422b92163cc',
  'cfd346cf-7973-576f-9a9a-154ae54efd32', 1, 'What decision did Daniel make before speaking to the official?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'c560c3b1-f015-5af5-a10c-fa3da86661a5',
  'cfd346cf-7973-576f-9a9a-154ae54efd32', 2, 'How did Daniel present his request?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '9e31ee38-c563-54f5-884a-00cd572b49cb',
  'cfd346cf-7973-576f-9a9a-154ae54efd32', 3, 'What is a practical, safe plan for leaving a pressured situation?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'fc0520cb-b720-510b-9ee0-687b6a75f746', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'teens',
  'Courage in Difficult Situations', null, 4,
  'not_reviewed', 'draft', 'Joshua is about to lead Israel after Moses’ death. The task is large and uncertain, so God repeatedly tells Joshua to be strong and courageous.',
  'For a difficult conversation or new responsibility, prepare the facts, ask a wise person for support, and take one honest step. Courage does not require tolerating abuse or entering unsafe situations.', 'Joshua 1:9',
  'God, stay with us in change and difficult responsibilities. Shape our courage with wisdom, truth, and care for others. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '761cdbd8-8907-5ce9-854b-5d7d708cb048',
  'fc0520cb-b720-510b-9ee0-687b6a75f746', 1, 'Joshua 1:6–9'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'ea187d2d-df82-5a74-912a-5211403cb463',
  'fc0520cb-b720-510b-9ee0-687b6a75f746', 1, 'Describe Joshua’s responsibility after Moses’ death.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '424f87ad-3259-56ec-b140-c56098b343e4',
  'fc0520cb-b720-510b-9ee0-687b6a75f746', 2, 'Connect courage in the passage with obedience to God’s instruction.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '700cf8a6-ff45-5269-ab9c-0f5cf6ea978e',
  'fc0520cb-b720-510b-9ee0-687b6a75f746', 3, 'Choose one supported, constructive next step in a hard situation.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '3c2a0473-4b91-5613-94bf-ea10bd1681a6',
  'fc0520cb-b720-510b-9ee0-687b6a75f746', 1, 'teaching_point', 'Joshua’s courage serves a responsibility',
  'God charges Joshua to lead the people into the land promised to their ancestors. Courage is tied to a concrete calling, not self-promotion.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '0852aa48-8c8d-5896-98f8-71cbfafd0608',
  'fc0520cb-b720-510b-9ee0-687b6a75f746', 2, 'teaching_point', 'Courage is joined to careful obedience',
  'Verses 7–8 tell Joshua to keep and meditate on the law given through Moses. The passage does not define courage as doing whatever feels bold; it is shaped by God’s instruction.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '31b72a87-a34e-52db-8c74-ff33b2903318',
  'fc0520cb-b720-510b-9ee0-687b6a75f746', 3, 'teaching_point', 'God promises presence',
  'God tells Joshua not to be afraid or discouraged because the Lord will be with him wherever he goes. The promise addresses a real transition and responsibility.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '8077a681-bf81-56e6-941d-2335a0a971bb', 'fc0520cb-b720-510b-9ee0-687b6a75f746',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'f9143bc3-9435-5189-8397-f5812cea23a9',
  '8077a681-bf81-56e6-941d-2335a0a971bb', 1, 'What responsibility was Joshua given?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '08bdc358-8f8f-525f-9fa3-530e57cd78c7',
  '8077a681-bf81-56e6-941d-2335a0a971bb', 2, 'What practices accompany the command to be courageous?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'a1d675b9-22b0-5b1b-beab-cd17d04d34a9',
  '8077a681-bf81-56e6-941d-2335a0a971bb', 3, 'How can you tell the difference between courage and unnecessary risk?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'ce4876b6-87c4-5ea6-a29a-75c9b495e0c6', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'teens',
  'Managing Anger', null, 5,
  'not_reviewed', 'draft', 'Messages can be sent quickly and regretted later. James 1:19–20 gives a short sequence for responding to others, especially when tension is rising.',
  'When upset, pause before replying, name the concern without insults, and return to the conversation when calm. If someone is threatening or abusive, prioritize safety and involve a trusted adult.', 'James 1:19',
  'God, help us listen carefully and speak with care. Teach us to respond to anger without causing harm. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  'b0111cf3-385c-5882-9182-5c84dd4becbc',
  'ce4876b6-87c4-5ea6-a29a-75c9b495e0c6', 1, 'James 1:19–20'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'cf43d36c-7cc3-5b81-b2cb-e86e6452f717',
  'ce4876b6-87c4-5ea6-a29a-75c9b495e0c6', 1, 'Explain James’ instruction to listen, speak, and become angry slowly.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '5956754b-47ab-56f1-acaa-cc4974983b30',
  'ce4876b6-87c4-5ea6-a29a-75c9b495e0c6', 2, 'Distinguish feeling anger from acting harmfully.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'd0057b3f-afbb-5631-a1c1-69eff2fbed1d',
  'ce4876b6-87c4-5ea6-a29a-75c9b495e0c6', 3, 'Practise a pause-and-respond strategy for conflict.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '84dd3222-2a00-5f9e-8bb2-557b2835298b',
  'ce4876b6-87c4-5ea6-a29a-75c9b495e0c6', 1, 'teaching_point', 'Listen before answering',
  'James tells believers to be quick to hear and slow to speak. Listening is an active choice to understand before preparing a comeback.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'a4958644-be41-5551-9416-d8f20073d0b5',
  'ce4876b6-87c4-5ea6-a29a-75c9b495e0c6', 2, 'teaching_point', 'Slow anger down',
  'The instruction is to be slow to anger, not to pretend that injustice or hurt does not matter. A pause can keep a strong feeling from controlling the next action.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'a2ca720a-7389-5d21-b407-fc902101100a',
  'ce4876b6-87c4-5ea6-a29a-75c9b495e0c6', 3, 'teaching_point', 'Human anger cannot produce God’s righteousness',
  'Verse 20 says human anger does not produce the righteousness God desires. James evaluates anger by its fruit and its ability to do what is right.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'e09e3274-de40-5f1c-b097-dc0ac2d9efc4', 'ce4876b6-87c4-5ea6-a29a-75c9b495e0c6',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'f21daee9-8023-56c9-8ccd-961ab680b93f',
  'e09e3274-de40-5f1c-b097-dc0ac2d9efc4', 1, 'What order does James give for listening, speaking, and anger?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'f43e49b0-8c28-5267-b91a-4f1923bc1917',
  'e09e3274-de40-5f1c-b097-dc0ac2d9efc4', 2, 'Why is a pause useful before responding online?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'd50a7e18-c638-53ee-830d-16dd10e96c4e',
  'e09e3274-de40-5f1c-b097-dc0ac2d9efc4', 3, 'What can you say to set a boundary without attacking someone?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'e98a358a-7ff3-5ace-a96d-e532dab5e0c7', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'teens',
  'Words That Build Others', null, 6,
  'not_reviewed', 'draft', 'Group chats and public comments can spread quickly. Ephesians 4 describes a new way of life in the community and gives a specific instruction about speech.',
  'Before posting, ask: Is it true? Is it needed? Will it help? If you shared harmful words, remove them where possible, apologize without excuses, and seek help if harassment is involved.', 'Ephesians 4:29',
  'God, guide our words in person and online. Help us speak truth with grace and repair harm when our words wound. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '83c9d96a-b2b1-5a83-a477-a207618dcb72',
  'e98a358a-7ff3-5ace-a96d-e532dab5e0c7', 1, 'Ephesians 4:29'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '50c338dd-b273-5a3c-b9fd-0bea8e298a32',
  'e98a358a-7ff3-5ace-a96d-e532dab5e0c7', 1, 'Describe the kind of speech Ephesians rejects and the speech it encourages.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'd657f16d-8308-5c89-871d-63e7a5610135',
  'e98a358a-7ff3-5ace-a96d-e532dab5e0c7', 2, 'Apply the tests of usefulness, need, and encouragement to communication.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '611f7494-c383-5c59-82dd-9ce53a80e91a',
  'e98a358a-7ff3-5ace-a96d-e532dab5e0c7', 3, 'Plan how to repair harm caused by careless words.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '0a4c05a8-d1ae-52db-a81f-2e92b2fe0f55',
  'e98a358a-7ff3-5ace-a96d-e532dab5e0c7', 1, 'teaching_point', 'Do not use speech that tears down',
  'The verse says corrupting talk should not come from the mouth. In its context, the instruction belongs to a community learning a changed way of living.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '90e1e8bd-8579-5c09-9b74-995ff94198e0',
  'e98a358a-7ff3-5ace-a96d-e532dab5e0c7', 2, 'teaching_point', 'Speak what is useful for building up',
  'Speech should fit the need and benefit those who hear. Encouragement is not flattery; it is truthful communication that helps rather than humiliates.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '6aac8e8c-8a15-5521-93f5-ae74177314fd',
  'e98a358a-7ff3-5ace-a96d-e532dab5e0c7', 3, 'teaching_point', 'Words can be timed to the moment',
  'The verse says to give grace to those who hear. Good speech considers the person, need, and moment instead of posting whatever earns attention.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '27c818e1-358e-5ad6-918f-67a13d6021d0', 'e98a358a-7ff3-5ace-a96d-e532dab5e0c7',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '4788a717-d34f-55bb-8dac-66bdac1b8fd1',
  '27c818e1-358e-5ad6-918f-67a13d6021d0', 1, 'What does “building up” look like in a disagreement?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'd2ba31a5-70dc-5995-aa50-ddf9b62ded2b',
  '27c818e1-358e-5ad6-918f-67a13d6021d0', 2, 'How can a message that gets laughs still cause harm?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'bc0ea8c7-38f9-574f-8489-1fcd8e574852',
  '27c818e1-358e-5ad6-918f-67a13d6021d0', 3, 'What steps make an apology more than just “sorry you felt that way”?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '7992373b-3e5b-5827-bfa0-35031dc77533', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'teens',
  'Forgiveness and Reconciliation', null, 7,
  'not_reviewed', 'draft', 'Peter asks Jesus how often he must forgive a brother or sister who sins against him. Jesus answers with a parable about a servant released from an enormous debt.',
  'Forgiveness may take time and can coexist with boundaries, consequences, and seeking help. Reconciliation requires truth, safety, and changed behavior; discuss serious harm with a trusted adult or qualified counselor.', 'Matthew 18:33',
  'God, thank you for mercy. Help us forgive honestly, seek justice and safety where needed, and become people who do not withhold compassion. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  'ff5d5f28-b345-523b-95ab-3b61cb7fa1de',
  '7992373b-3e5b-5827-bfa0-35031dc77533', 1, 'Matthew 18:21–35'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'c1351eb5-08a4-5853-ae85-20ef10ac1615',
  '7992373b-3e5b-5827-bfa0-35031dc77533', 1, 'Summarize the contrast in Jesus’ parable between received mercy and withheld mercy.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '1e1702aa-67f9-50c0-b2d7-f27869a480f7',
  '7992373b-3e5b-5827-bfa0-35031dc77533', 2, 'Explain how forgiveness relates to the passage’s picture of God’s kingdom.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'fe572b3e-36b3-5566-99f2-9e924bc07442',
  '7992373b-3e5b-5827-bfa0-35031dc77533', 3, 'Distinguish forgiveness from unsafe or unearned restoration of trust.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'feb4dda8-1979-5e6e-8bae-03f18d3a175c',
  '7992373b-3e5b-5827-bfa0-35031dc77533', 1, 'teaching_point', 'The king releases a debt the servant cannot repay',
  'The first servant owes an impossible amount. The king responds to his plea with compassion and cancels the debt.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'ab66b052-9a78-5284-a059-64ef2b84432e',
  '7992373b-3e5b-5827-bfa0-35031dc77533', 2, 'teaching_point', 'The forgiven servant refuses mercy to another',
  'The same servant demands payment from a fellow servant over a much smaller debt and has him imprisoned. Other servants are distressed and report what happened.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '884078c6-6a86-5b01-b05a-11f7c1969dc8',
  '7992373b-3e5b-5827-bfa0-35031dc77533', 3, 'teaching_point', 'Jesus warns against refusing mercy',
  'The king confronts the servant for failing to show the mercy he received. Jesus concludes that forgiveness must come from the heart. The parable does not command victims to hide harm or restore unsafe access.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'f959767a-8d03-5b18-9dc2-2e0c6679dacd', '7992373b-3e5b-5827-bfa0-35031dc77533',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'b34fb4ac-fcc6-5bb7-8621-47919cc7defb',
  'f959767a-8d03-5b18-9dc2-2e0c6679dacd', 1, 'What contrast does Jesus create between the two servants?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '0bc40394-5bd0-51fc-a833-3d27aef059df',
  'f959767a-8d03-5b18-9dc2-2e0c6679dacd', 2, 'Why are the other servants distressed?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '4c3fa6e5-6a8e-5676-abb6-712d97af2df2',
  'f959767a-8d03-5b18-9dc2-2e0c6679dacd', 3, 'How can forgiveness and a protective boundary exist together?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '9f46d98f-cacd-50ee-a80f-302bf6f780d3', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'teens',
  'Faith During Uncertainty', null, 8,
  'not_reviewed', 'draft', 'Uncertainty about friendships, exams, family changes, or the future can make people demand a perfect answer immediately. Proverbs 3:5–6 offers wisdom about trust and direction.',
  'For a real decision, list what you know, pray, consult a trustworthy and informed person, and choose the next honest step. Avoid treating a verse as permission to ignore evidence or safety.', 'Proverbs 3:5–6',
  'God, guide us when we cannot see the whole path. Help us trust you, think carefully, and seek wise counsel. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  'bc4dfac5-b4ba-5a90-8c51-93c5d2e14cc0',
  '9f46d98f-cacd-50ee-a80f-302bf6f780d3', 1, 'Proverbs 3:5–6'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '5cc31160-49cf-595e-8cbc-9578f8498096',
  '9f46d98f-cacd-50ee-a80f-302bf6f780d3', 1, 'Interpret the proverb’s contrast between trusting God and relying only on one’s own understanding.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'c0f726b1-2a63-56dd-a64d-1d271b26a32d',
  '9f46d98f-cacd-50ee-a80f-302bf6f780d3', 2, 'Describe what acknowledging God in one’s paths can mean.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '9ced1e55-4b77-503c-9087-b6b07b59963e',
  '9f46d98f-cacd-50ee-a80f-302bf6f780d3', 3, 'Use prayer, counsel, and evidence in an uncertain decision.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'dd25842a-422f-581c-b5d1-31bb0a79bb97',
  '9f46d98f-cacd-50ee-a80f-302bf6f780d3', 1, 'teaching_point', 'Trust involves the whole heart',
  'The proverb calls the learner to trust the Lord with all the heart. It addresses the center of loyalty and dependence, not just a passing feeling.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '29666fdc-a3cc-5201-ada7-0fc2a72effb7',
  '9f46d98f-cacd-50ee-a80f-302bf6f780d3', 2, 'teaching_point', 'Do not make your own understanding the only guide',
  'The verse warns against leaning on one’s own understanding. It does not forbid thinking; it cautions that human perspective is limited and needs God’s wisdom.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '4af2aa61-164d-5ded-b71c-8dbb01809239',
  '9f46d98f-cacd-50ee-a80f-302bf6f780d3', 3, 'teaching_point', 'Acknowledge God in the path',
  'The learner is to acknowledge God in all their ways, with the promise that God will make paths straight. The image is guidance for faithful living, not a guarantee of an effortless outcome.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '0795b7b2-deb1-5eed-9797-85eeaf88bdc6', '9f46d98f-cacd-50ee-a80f-302bf6f780d3',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'e71816c9-6677-5e2e-ad56-9ee3aff3fa17',
  '0795b7b2-deb1-5eed-9797-85eeaf88bdc6', 1, 'What does “leaning” on your own understanding suggest?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '73549809-3038-52cb-90cc-5adcf8d2d59e',
  '0795b7b2-deb1-5eed-9797-85eeaf88bdc6', 2, 'Who can offer wise and trustworthy counsel for a decision?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '430d1324-5d3b-54eb-a661-acecb36a8c2c',
  '0795b7b2-deb1-5eed-9797-85eeaf88bdc6', 3, 'How can trust in God help without promising an easy result?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'd427888d-68f9-59e7-a391-2624f4040750', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'teens',
  'Prayer and Personal Growth', null, 9,
  'not_reviewed', 'draft', 'In the Sermon on the Mount, Jesus teaches about prayer. He challenges prayer used to impress people and gives his disciples a pattern for addressing God.',
  'Try a brief daily pattern: address God, name one thing you are grateful for, ask for a real need, seek forgiveness or strength to forgive, and ask for guidance.', 'Matthew 6:9–13',
  'Our Father, teach us to pray sincerely. Give us what we need, forgive us, help us forgive, and guide us away from harm. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '992b1c93-dbb8-5819-bea5-987913a8db5d',
  'd427888d-68f9-59e7-a391-2624f4040750', 1, 'Matthew 6:5–13'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'f1e761d0-b80e-560a-943b-40651dd00c7d',
  'd427888d-68f9-59e7-a391-2624f4040750', 1, 'Identify Jesus’ warnings against performative and empty prayer.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '567e2629-1781-5138-a37c-f14b0c56481b',
  'd427888d-68f9-59e7-a391-2624f4040750', 2, 'Explain the main concerns in the Lord’s Prayer.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'fc0a7092-4c7e-5557-8d5c-6a4053ee8463',
  'd427888d-68f9-59e7-a391-2624f4040750', 3, 'Build a simple prayer rhythm that includes God, needs, forgiveness, and guidance.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '36e6018b-e187-5857-ad78-d34533a4f81d',
  'd427888d-68f9-59e7-a391-2624f4040750', 1, 'teaching_point', 'Prayer is not a performance',
  'Jesus warns against praying to be seen by others and against thinking that many words force God to listen. He describes prayer as relationship with the Father who knows what is needed.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '9e7f2626-3307-55d0-be6a-78b971880e92',
  'd427888d-68f9-59e7-a391-2624f4040750', 2, 'teaching_point', 'The prayer begins with God',
  'The Lord’s Prayer begins with God’s name, kingdom, and will. It sets personal requests within a desire for God’s reign and purposes.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '8a8c053e-7c38-55fa-95eb-ec67e8388ac9',
  'd427888d-68f9-59e7-a391-2624f4040750', 3, 'teaching_point', 'The prayer includes ordinary and moral needs',
  'The prayer asks for daily bread, forgiveness, and deliverance from temptation. Jesus’ pattern joins dependence on God with receiving and extending forgiveness.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '8adaf4e0-f5d3-5e5a-bd91-c3fb6ddac53b', 'd427888d-68f9-59e7-a391-2624f4040750',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '52324005-dae8-560d-a7c9-f8506be44fcf',
  '8adaf4e0-f5d3-5e5a-bd91-c3fb6ddac53b', 1, 'What does Jesus criticize about prayer done for an audience?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'f962d7fb-fce4-5641-84f6-029bf9343514',
  '8adaf4e0-f5d3-5e5a-bd91-c3fb6ddac53b', 2, 'Why does the prayer ask for daily bread rather than endless wealth?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '3dbba8fa-eef5-5174-b49e-99b311ccbe28',
  '8adaf4e0-f5d3-5e5a-bd91-c3fb6ddac53b', 3, 'Which part of the prayer would help you most in a stressful week?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'c59cf053-eddb-5d1b-b96c-b1163d42295f', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'teens',
  'Using Time Wisely', null, 10,
  'not_reviewed', 'draft', 'A full schedule can still be poorly ordered. Ephesians 5 calls believers to live carefully, make good use of time, and understand the Lord’s will.',
  'Review one week of commitments. Set aside time for sleep, learning, responsibilities, relationships, and worship. Ask for help if overload is affecting health or wellbeing.', 'Ephesians 5:15–16',
  'God, teach us to use our days wisely. Help us recognize your purposes and make room for responsibility, rest, and love. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  'c991aa00-399d-5683-be30-6c27e701f710',
  'c59cf053-eddb-5d1b-b96c-b1163d42295f', 1, 'Ephesians 5:15–17'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'fce1ddcb-f7f7-5e39-ac41-3a9437f920c0',
  'c59cf053-eddb-5d1b-b96c-b1163d42295f', 1, 'Explain the contrast between wise and unwise living in the passage.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'f9b79bd2-2d8a-5f75-a93b-5b05ce83b862',
  'c59cf053-eddb-5d1b-b96c-b1163d42295f', 2, 'Interpret “making the most of the time” in its context.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'cbc4f300-7dc4-5852-b8c4-5dd7004aad0c',
  'c59cf053-eddb-5d1b-b96c-b1163d42295f', 3, 'Make a realistic plan balancing responsibilities, rest, and service.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '9d0abf1e-901b-5c50-9fb7-215dfe6c54b0',
  'c59cf053-eddb-5d1b-b96c-b1163d42295f', 1, 'teaching_point', 'Pay attention to how you live',
  'The passage tells readers to be careful how they live, not as unwise but as wise. Wisdom is shown in deliberate choices rather than drifting without thought.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'f60cb4f4-2fdf-5a31-a480-d2be1a945f0a',
  'c59cf053-eddb-5d1b-b96c-b1163d42295f', 2, 'teaching_point', 'The days require discernment',
  'The phrase “making the most of the time” appears with the reason that the days are evil. It calls for alert, faithful use of opportunities in a difficult world.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '9657cd05-4ee9-53c6-ac1c-e6603ec2986f',
  'c59cf053-eddb-5d1b-b96c-b1163d42295f', 3, 'teaching_point', 'Seek understanding of God’s will',
  'Verse 17 contrasts foolishness with understanding the Lord’s will. The passage points beyond productivity toward a life shaped by God’s purposes.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '1fb716e4-39ae-5ec1-ba63-86e3261a5a24', 'c59cf053-eddb-5d1b-b96c-b1163d42295f',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '7149302a-11f1-53cb-ba37-f03faf0a2770',
  '1fb716e4-39ae-5ec1-ba63-86e3261a5a24', 1, 'What does careful living look like beyond filling every minute?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'e21b74eb-becf-5269-93ef-d1398f8fcc44',
  '1fb716e4-39ae-5ec1-ba63-86e3261a5a24', 2, 'Which opportunities in your week deserve attention?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '7659153f-6fd3-5b99-9f4b-0108d3a6fbf3',
  '1fb716e4-39ae-5ec1-ba63-86e3261a5a24', 3, 'How can rest fit into wise use of time?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '0c3fc81a-ef91-5769-bc57-a616856905cd', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'teens',
  'Integrity When Nobody Is Watching', null, 11,
  'not_reviewed', 'draft', 'It can seem easy to take a shortcut when no one is watching: copying work, hiding a mistake, or presenting someone else’s idea as your own. Proverbs 10:9 links integrity with security.',
  'Choose one area where honesty is hard. Correct the record, acknowledge your part, and ask a trusted adult how to make things right if the consequences feel serious.', 'Proverbs 10:9',
  'God, make us people of integrity in public and private. Give us courage to tell the truth and repair what we have damaged. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  'c0f781b4-28ca-53f1-b5e7-31991f1b349c',
  '0c3fc81a-ef91-5769-bc57-a616856905cd', 1, 'Proverbs 10:9'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '9f722a1b-99d6-5e7d-8066-5baed6772984',
  '0c3fc81a-ef91-5769-bc57-a616856905cd', 1, 'Explain the proverb’s contrast between walking in integrity and crooked ways.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '99676e76-76b1-5cd7-9b38-7b190a20ea03',
  '0c3fc81a-ef91-5769-bc57-a616856905cd', 2, 'Apply integrity to schoolwork, money, and digital choices.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '9f09a75d-d322-53b8-9f62-dfa494c1257f',
  '0c3fc81a-ef91-5769-bc57-a616856905cd', 3, 'Identify a safe way to admit and repair a dishonest choice.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '368e6976-beeb-5f8c-bcaf-4f559f5b74d8',
  '0c3fc81a-ef91-5769-bc57-a616856905cd', 1, 'teaching_point', 'Integrity describes a whole way of life',
  'The proverb says the one who walks in integrity walks securely. The image suggests consistency between what a person claims and how they act.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '7bae6edb-c614-5467-9da7-695ec01d68b6',
  '0c3fc81a-ef91-5769-bc57-a616856905cd', 2, 'teaching_point', 'Crookedness eventually becomes visible',
  'The second line says the one who makes their ways crooked will be found out. Dishonesty creates vulnerability because it must be concealed and can harm trust.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '361e4143-b7df-5c6d-a651-3dc274422e2f',
  '0c3fc81a-ef91-5769-bc57-a616856905cd', 3, 'teaching_point', 'Integrity is more than avoiding detection',
  'The proverb praises a reliable path, not a clever way to escape consequences. Integrity matters even when discovery seems unlikely.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '28dbed0a-0779-5733-aa8d-572801d9f2ac', '0c3fc81a-ef91-5769-bc57-a616856905cd',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '8b8e3a5d-ce5f-57ae-9d49-f0173f1e69be',
  '28dbed0a-0779-5733-aa8d-572801d9f2ac', 1, 'What is the difference between integrity and simply not getting caught?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '2eb90b47-1b93-5e92-82ed-e97ee88ffbf3',
  '28dbed0a-0779-5733-aa8d-572801d9f2ac', 2, 'How can honesty protect trust in a friendship or team?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'e5f90414-565e-5fb8-ba95-cbe4df4d45c4',
  '28dbed0a-0779-5733-aa8d-572801d9f2ac', 3, 'What makes admitting a mistake difficult, and what support helps?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '4bd2ae2a-66e6-556f-bc35-c4ea7283fb1e', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'teens',
  'Serving Others', null, 12,
  'not_reviewed', 'draft', 'James and John have asked for places of honor. The other disciples become indignant, and Jesus uses the moment to teach a different pattern of leadership.',
  'Choose a helpful task that meets a real need without seeking applause. Healthy service is voluntary and bounded; tell a trusted adult if someone is coercing, exploiting, or endangering you.', 'Mark 10:45',
  'Jesus, teach us to serve as you served. Help us use influence for others’ good and recognize when a boundary or help is needed. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '8b220008-f17b-5f63-94ca-66ad3276cee0',
  '4bd2ae2a-66e6-556f-bc35-c4ea7283fb1e', 1, 'Mark 10:42–45'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'ecca8429-b8be-512f-8961-129976bbcd8c',
  '4bd2ae2a-66e6-556f-bc35-c4ea7283fb1e', 1, 'Explain how Jesus contrasts his community with rulers who dominate others.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'e0862a3d-a438-5a7d-bc39-50c597d86486',
  '4bd2ae2a-66e6-556f-bc35-c4ea7283fb1e', 2, 'Describe Jesus’ teaching about becoming a servant.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '237d8326-e8d9-5390-979f-25db29e7a70b',
  '4bd2ae2a-66e6-556f-bc35-c4ea7283fb1e', 3, 'Distinguish freely chosen service from exploitation or coercion.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'eeb06e4b-c715-5ee0-8774-cbc78137495c',
  '4bd2ae2a-66e6-556f-bc35-c4ea7283fb1e', 1, 'teaching_point', 'Jesus names domination as a worldly pattern',
  'Jesus says rulers of the Gentiles lord it over people and exercise authority over them. He describes power used to control and elevate oneself.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'cb485321-32bb-5141-b00e-19c9206969e0',
  '4bd2ae2a-66e6-556f-bc35-c4ea7283fb1e', 2, 'teaching_point', 'Greatness is redefined as service',
  'Jesus tells his followers that whoever wants to become great must be a servant, and whoever wants to be first must be slave of all. Service is not a way to secretly gain status; it reverses self-centered ambition.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '5a06fc51-a5e1-5c01-a534-2090d43c124e',
  '4bd2ae2a-66e6-556f-bc35-c4ea7283fb1e', 3, 'teaching_point', 'Jesus gives his own life',
  'The Son of Man came not to be served but to serve and give his life as a ransom for many. Jesus grounds the teaching in his mission, not in forced labor from vulnerable people.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '653e27e1-fc34-5077-8eb9-3be444120edd', '4bd2ae2a-66e6-556f-bc35-c4ea7283fb1e',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'b8102cf2-535a-5330-8f39-ab3700a3e4af',
  '653e27e1-fc34-5077-8eb9-3be444120edd', 1, 'What kind of leadership does Jesus criticize?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'b57593b3-87c5-5fd8-91a4-a5f5655640d5',
  '653e27e1-fc34-5077-8eb9-3be444120edd', 2, 'How is serving different from doing something only to gain popularity?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '0f874223-6ba3-5905-a4e8-5d410c7e063d',
  '653e27e1-fc34-5077-8eb9-3be444120edd', 3, 'What boundary helps make service healthy and voluntary?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '23418ae5-ac00-5704-b454-c47aca8bb0e1', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'adults',
  'Understanding God’s Character', null, 1,
  'not_reviewed', 'draft', 'After Israel’s covenant failure with the golden calf, Moses returns to the Lord at Sinai with new tablets. In Exodus 34 God descends in the cloud and proclaims the divine name and character.',
  'In a conflict, practise compassion without denial: name harm truthfully, seek repair, and preserve accountability. Resist using “grace” to silence those who have been harmed.', 'Exodus 34:6',
  'Lord, teach us your compassion, patience, faithfulness, and justice. Help us extend mercy without denying truth or protecting wrongdoing. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  'defcf14c-dafa-51f2-8f9f-2a18562f4f7d',
  '23418ae5-ac00-5704-b454-c47aca8bb0e1', 1, 'Exodus 34:5–7'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '349f71c4-ebbb-53e6-a1b5-e182fe02be4b',
  '23418ae5-ac00-5704-b454-c47aca8bb0e1', 1, 'Identify the attributes God proclaims in the passage.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'be81032e-0005-5de5-aa0a-145a1f1a433b',
  '23418ae5-ac00-5704-b454-c47aca8bb0e1', 2, 'Hold together the text’s language about mercy, justice, and accountability.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '3669f3bb-9ad6-56da-90ba-d9e0471fae59',
  '23418ae5-ac00-5704-b454-c47aca8bb0e1', 3, 'Reflect on how God’s character should shape personal and communal conduct.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '543a0720-6a3e-5dc5-b4b6-f9aa4069fb7c',
  '23418ae5-ac00-5704-b454-c47aca8bb0e1', 1, 'teaching_point', 'The Lord is merciful and gracious',
  'Verses 5–6 describe the Lord as compassionate, gracious, slow to anger, and abounding in steadfast love and faithfulness. These are God’s self-declared qualities in a moment of covenant renewal.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '84364b7d-21fc-5921-af62-27b83f557d7a',
  '23418ae5-ac00-5704-b454-c47aca8bb0e1', 2, 'teaching_point', 'Mercy includes forgiveness',
  'Verse 7 says God maintains love and forgives iniquity, rebellion, and sin. The text speaks of real wrongdoing rather than minimizing it.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '71152665-673d-5d82-af96-c96704d42363',
  '23418ae5-ac00-5704-b454-c47aca8bb0e1', 3, 'teaching_point', 'Compassion does not erase accountability',
  'The same verse says God does not simply leave the guilty unpunished and describes consequences across generations. Read together, the lines hold mercy and moral seriousness in tension; they are not a license for people to claim divine authority to punish others.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '8271056f-1dc8-5a7d-b024-a2f2ff6f947c', '23418ae5-ac00-5704-b454-c47aca8bb0e1',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '9d534428-27f6-532e-96d9-a93c421f1649',
  '8271056f-1dc8-5a7d-b024-a2f2ff6f947c', 1, 'Which attributes does God proclaim in verses 6–7?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'b7855298-27ea-5a4c-8019-3bb866fcf8a9',
  '8271056f-1dc8-5a7d-b024-a2f2ff6f947c', 2, 'Why is it important to read forgiveness and accountability together?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'e0ddf99e-bc2d-50c6-afc4-5fbbd2c33275',
  '8271056f-1dc8-5a7d-b024-a2f2ff6f947c', 3, 'How can a community show mercy while still addressing harm responsibly?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '1beb0919-813c-53f1-880c-4fc594e34202', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'adults',
  'Growing Through Scripture', null, 2,
  'not_reviewed', 'draft', 'The letter urges Timothy to remain in what he has learned, remembering those from whom he learned it. It refers to the sacred writings Timothy knew from childhood and describes their purpose.',
  'Choose a short passage, identify its speaker, audience, and context, note what it teaches or corrects, and name one action that fits its purpose. Compare interpretations with trusted, responsible readers.', '2 Timothy 3:16–17',
  'God, form us through Scripture. Give us humility to learn, courage to be corrected, and readiness to do good. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  'e981ce35-3b54-5159-bfaa-28e7f351959b',
  '1beb0919-813c-53f1-880c-4fc594e34202', 1, '2 Timothy 3:14–17'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '95134c54-a6c4-5aeb-87df-7fa9ae2520a9',
  '1beb0919-813c-53f1-880c-4fc594e34202', 1, 'Explain the passage’s description of Scripture’s role.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '125bd72c-e070-5460-9a71-ed29cbe483f5',
  '1beb0919-813c-53f1-880c-4fc594e34202', 2, 'Connect teaching, correction, and training with formation for good work.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '7b7b5870-b941-5323-b506-72f6ec91f679',
  '1beb0919-813c-53f1-880c-4fc594e34202', 3, 'Adopt a careful practice of reading context before applying a text.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '59348a4a-b1b4-53e0-823d-ae6413f76144',
  '1beb0919-813c-53f1-880c-4fc594e34202', 1, 'teaching_point', 'Remain grounded in what has been learned',
  'Verses 14–15 connect Timothy’s knowledge with trusted teachers and the sacred writings. The text values learning within a community of faithful transmission.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'cf54a082-c15e-5c7c-808f-7e6916e920ac',
  '1beb0919-813c-53f1-880c-4fc594e34202', 2, 'teaching_point', 'Scripture is useful for formation',
  'Verse 16 names teaching, reproof, correction, and training in righteousness. Scripture both instructs and challenges the reader; it is not merely a source of slogans.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '792589ee-18e2-59ed-bc9d-a948b9878f8d',
  '1beb0919-813c-53f1-880c-4fc594e34202', 3, 'teaching_point', 'The aim is readiness for good work',
  'Verse 17 says the person of God may be complete and equipped for every good work. Interpretation should therefore form faithful practice, not pride or manipulation.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'c6eed170-1bcc-5bf6-aeff-c9a11f179636', '1beb0919-813c-53f1-880c-4fc594e34202',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '5d144186-089b-5f9d-9f69-9a84f9bb1196',
  'c6eed170-1bcc-5bf6-aeff-c9a11f179636', 1, 'What practices does the passage say Scripture supports?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '50beaa66-7a57-5d49-be2f-cbd7a6947426',
  'c6eed170-1bcc-5bf6-aeff-c9a11f179636', 2, 'How can correction be received without defensiveness?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '11bedf6b-6dad-5dfa-bb5e-002e5bfd58f1',
  'c6eed170-1bcc-5bf6-aeff-c9a11f179636', 3, 'What good work might a careful reading equip you to do?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '7adb4e4f-bbd4-5fc3-bd47-0a16cb1e7b6b', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'adults',
  'Developing a Consistent Prayer Life', null, 3,
  'not_reviewed', 'draft', 'After Jesus prays, one disciple asks him to teach them to pray. Jesus gives a model prayer, a parable about a midnight request, and an assurance about the Father’s generosity.',
  'Choose a realistic time and a short pattern: praise, God’s purposes, needs, confession and forgiveness, and guidance. Keep a brief list and revisit it without treating unanswered requests as personal failure.', 'Luke 11:9–10',
  'Father, hallow your name and bring your kingdom. Give what we need, forgive us, guide us, and form us by your Spirit. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '6835f7fa-03be-5224-8a49-d0a9ec9eb525',
  '7adb4e4f-bbd4-5fc3-bd47-0a16cb1e7b6b', 1, 'Luke 11:1–13'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'bdaf1cc2-8408-50d8-a8c9-8fabcac1c794',
  '7adb4e4f-bbd4-5fc3-bd47-0a16cb1e7b6b', 1, 'Identify the petitions in the prayer Jesus teaches.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '6ce21cc8-13be-51ec-8f6d-4271e89ed284',
  '7adb4e4f-bbd4-5fc3-bd47-0a16cb1e7b6b', 2, 'Explain how the neighbor parable and father-child image encourage persistence and trust.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'd25fc7a5-f916-56f7-834a-dd3f20d46802',
  '7adb4e4f-bbd4-5fc3-bd47-0a16cb1e7b6b', 3, 'Develop a sustainable prayer rhythm that includes dependence and God’s purposes.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'f4835faf-3643-5e49-b49c-a979284bd6e5',
  '7adb4e4f-bbd4-5fc3-bd47-0a16cb1e7b6b', 1, 'teaching_point', 'Prayer begins with God’s name and kingdom',
  'The prayer addresses the Father, asks that God’s name be hallowed, and asks for the kingdom to come. Personal needs are set within God’s purposes.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '7b3f9caa-59f5-5a47-83d4-9f5b1008573b',
  '7adb4e4f-bbd4-5fc3-bd47-0a16cb1e7b6b', 2, 'teaching_point', 'Daily dependence includes bread and forgiveness',
  'Jesus teaches requests for daily bread, forgiveness, and protection in testing. The prayer links receiving forgiveness with forgiving others.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'd4869fc4-684d-5a77-ab6e-cd8cd2ab1e75',
  '7adb4e4f-bbd4-5fc3-bd47-0a16cb1e7b6b', 3, 'teaching_point', 'Persistence rests in the Father’s goodness',
  'The midnight neighbor story emphasizes persistent asking. Jesus then compares imperfect human parents with the Father, who gives the Holy Spirit to those who ask. Prayer is trust, not a technique to control outcomes.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '9f7e453d-1799-5f55-8845-9c155555d6ff', '7adb4e4f-bbd4-5fc3-bd47-0a16cb1e7b6b',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'dea93cf3-a910-5da0-8fab-dfcdf2671e22',
  '9f7e453d-1799-5f55-8845-9c155555d6ff', 1, 'What is the order of concerns in the prayer Jesus gives?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '2ad020e1-c8b0-5a18-be87-b831eac74411',
  '9f7e453d-1799-5f55-8845-9c155555d6ff', 2, 'What does the neighbor story teach about persistence?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'a316b824-5a42-5001-ae37-ef84f43bac85',
  '9f7e453d-1799-5f55-8845-9c155555d6ff', 3, 'How can a prayer rhythm remain steady without becoming a performance?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '2d10e423-30d2-53de-8934-ab65ee734de5', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'adults',
  'Faith During Difficult Seasons', null, 4,
  'not_reviewed', 'draft', 'James writes to believers scattered among the nations and speaks directly about trials. The passage neither denies suffering nor calls hardship pleasant in itself.',
  'Name the difficulty honestly, ask God for wisdom, and identify one practical support: a trusted friend, pastor, clinician, or community resource. Avoid telling suffering people that they simply lack faith.', 'James 1:5',
  'God, meet us in difficult seasons. Give wisdom generously, sustain endurance, and help us support one another with compassion. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '9d05c33c-6630-56a8-ab8e-2636016669b2',
  '2d10e423-30d2-53de-8934-ab65ee734de5', 1, 'James 1:2–8'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '4af958e1-0d8b-55f0-bfd5-2bfe06c233d4',
  '2d10e423-30d2-53de-8934-ab65ee734de5', 1, 'Trace James’ movement from trials to endurance and maturity.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'd7c0a8c3-e360-5511-9e54-7b9b5f5da48f',
  '2d10e423-30d2-53de-8934-ab65ee734de5', 2, 'Understand the invitation to ask God for wisdom.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '8a2359f9-90e1-513e-8ef8-70a2e0a267b1',
  '2d10e423-30d2-53de-8934-ab65ee734de5', 3, 'Respond to hardship with honest lament, wise support, and faithful action.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '97003c31-7931-5d1f-bc14-d593a9a4b889',
  '2d10e423-30d2-53de-8934-ab65ee734de5', 1, 'teaching_point', 'Trials test faith and develop endurance',
  'Verses 2–3 say the testing of faith produces perseverance. James invites a perspective of joy because of what endurance can form, not because pain is unreal.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '5d53e1dd-7395-58cd-b5c7-2fcdc509f1d1',
  '2d10e423-30d2-53de-8934-ab65ee734de5', 2, 'teaching_point', 'Endurance is meant to complete its work',
  'Verse 4 urges perseverance to finish its work so believers may be mature and complete. Growth is a process rather than a demand for instant strength.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '7475a496-e896-5e44-b7f3-0436bd26d9b2',
  '2d10e423-30d2-53de-8934-ab65ee734de5', 3, 'teaching_point', 'Ask God for wisdom in the trial',
  'Verses 5–8 invite anyone lacking wisdom to ask God, who gives generously. The passage warns against divided allegiance; it does not shame people for grief, questions, or seeking professional help.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'a0edc52e-9188-5774-a4df-32efbe83b6d0', '2d10e423-30d2-53de-8934-ab65ee734de5',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '3cd538d9-2b0b-5373-aa98-047577d1caf9',
  'a0edc52e-9188-5774-a4df-32efbe83b6d0', 1, 'What does James say testing can produce?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '8bd43582-6c8e-51bc-9741-d4a6a19a1c34',
  'a0edc52e-9188-5774-a4df-32efbe83b6d0', 2, 'What might wisdom look like in a hardship that cannot be quickly changed?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'a014c172-9a7a-57c4-b5f7-5761ad3f91be',
  'a0edc52e-9188-5774-a4df-32efbe83b6d0', 3, 'How can a faith community support someone without minimizing their pain?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'db58f679-8353-5695-8736-8883a2b14968', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'adults',
  'Forgiveness and Reconciliation', null, 5,
  'not_reviewed', 'draft', 'Colossians 3 describes the new life of a community chosen and loved by God. The instruction about forgiveness sits among compassion, kindness, humility, gentleness, patience, and love.',
  'Where safe, identify the harm, communicate a clear boundary, and consider what repair is possible. In abuse or coercion, prioritize protection, seek qualified support, and do not pressure a harmed person into contact.', 'Colossians 3:13–14',
  'Lord, clothe us with compassion and patience. Teach us forgiveness shaped by your mercy, joined with truth, repair, and protection of the vulnerable. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '0ccde2db-0f57-5b57-9d5b-97f752b77172',
  'db58f679-8353-5695-8736-8883a2b14968', 1, 'Colossians 3:12–14'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '8ecc9ca9-c2c8-5bc8-8aa4-3ef0ff8d66ea',
  'db58f679-8353-5695-8736-8883a2b14968', 1, 'Identify the virtues the passage calls the community to put on.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '8623c4bb-1cb1-52e6-90d0-44127226c730',
  'db58f679-8353-5695-8736-8883a2b14968', 2, 'Explain the grounding and pattern of forgiveness in Christ.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '4c498b81-6439-5471-ae16-cd2910a62456',
  'db58f679-8353-5695-8736-8883a2b14968', 3, 'Distinguish forgiveness from bypassing accountability or safety.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'e55ec4b0-5d34-5578-9fed-accff2db5ddd',
  'db58f679-8353-5695-8736-8883a2b14968', 1, 'teaching_point', 'The community is called to compassion',
  'Verse 12 names compassion, kindness, humility, gentleness, and patience as clothing for God’s people. These are communal practices, not private sentiments alone.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'ad39ad8c-b0c8-5803-8f7d-3d89d9fc8968',
  'db58f679-8353-5695-8736-8883a2b14968', 2, 'teaching_point', 'Bear with one another and forgive',
  'Verse 13 addresses grievances and tells believers to forgive as the Lord forgave them. Forgiveness acknowledges that a real grievance exists and calls the community away from retaliation.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'f47f85fa-8b8a-5511-9642-3304689fd049',
  'db58f679-8353-5695-8736-8883a2b14968', 3, 'teaching_point', 'Love binds the virtues together',
  'Verse 14 calls love the bond of perfection or completeness. Reconciliation may require truth, repair, changed behavior, and safety; the passage does not require returning to an abusive or dangerous relationship.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '56de79e1-7324-5164-9598-fd1ad7336fc0', 'db58f679-8353-5695-8736-8883a2b14968',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '3f9626ac-7d11-54e2-a972-7bf7d107e2de',
  '56de79e1-7324-5164-9598-fd1ad7336fc0', 1, 'Which virtues surround the instruction to forgive?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '0d3ef9c5-ae05-5644-90e8-604d9c12cd13',
  '56de79e1-7324-5164-9598-fd1ad7336fc0', 2, 'What does “as the Lord forgave you” contribute to the passage?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'eee64528-2919-5692-9e16-e667dd346462',
  '56de79e1-7324-5164-9598-fd1ad7336fc0', 3, 'What conditions are necessary for reconciliation to be safe and truthful?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '07f37c5c-8f29-537a-bcf0-bcdeb5ca5e4e', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'adults',
  'Stewardship and Responsibility', null, 6,
  'not_reviewed', 'draft', 'Luke 16 follows the parable of the shrewd manager. Jesus turns to his disciples and speaks about trustworthiness, entrusted wealth, and the impossibility of serving both God and money.',
  'Review one financial or organizational responsibility for honesty, transparency, and care for people affected by it. Seek independent advice when decisions involve debt, exploitation, or complex obligations.', 'Luke 16:10',
  'God, teach us to handle resources faithfully. Free us from serving money and help us use what is entrusted to us for good. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '23b39bcb-dfef-56e8-b7eb-9843dc295be0',
  '07f37c5c-8f29-537a-bcf0-bcdeb5ca5e4e', 1, 'Luke 16:10–13'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'a0f6f1b1-d009-5b24-aea3-26976f824c21',
  '07f37c5c-8f29-537a-bcf0-bcdeb5ca5e4e', 1, 'Read Jesus’ teaching about faithfulness in small and great matters.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'd8bc16e6-f599-534f-898c-9ade63997d6b',
  '07f37c5c-8f29-537a-bcf0-bcdeb5ca5e4e', 2, 'Explain why money and service are matters of allegiance in the passage.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '8333e6e1-b3b4-5e20-889f-539002ec53f2',
  '07f37c5c-8f29-537a-bcf0-bcdeb5ca5e4e', 3, 'Apply stewardship through transparent, responsible use of resources.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'ca0d8022-3b96-53c4-96c9-3fa36845440b',
  '07f37c5c-8f29-537a-bcf0-bcdeb5ca5e4e', 1, 'teaching_point', 'Faithfulness is consistent across scale',
  'Jesus says whoever is faithful in little is faithful also in much, and whoever is dishonest in little is dishonest in much. Small choices reveal habits of trust.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '7db239f5-04d4-51b6-8ae5-86c020f772b7',
  '07f37c5c-8f29-537a-bcf0-bcdeb5ca5e4e', 2, 'teaching_point', 'Resources are entrusted, not absolute masters',
  'Verses 11–12 ask whether a person can be trusted with true riches if unfaithful with worldly wealth. The passage challenges how disciples handle what is entrusted to them.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '1a399e91-3897-52e7-b5f4-9454f65705cc',
  '07f37c5c-8f29-537a-bcf0-bcdeb5ca5e4e', 3, 'teaching_point', 'Money competes for service',
  'Verse 13 says no servant can serve two masters and names God and money. Jesus presents money as a possible rival for ultimate loyalty, not merely a neutral tool.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '740677c9-f560-54d3-acf2-3cd50215ff40', '07f37c5c-8f29-537a-bcf0-bcdeb5ca5e4e',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '9f8d7855-2b5d-5e9a-aff2-3746bb610306',
  '740677c9-f560-54d3-acf2-3cd50215ff40', 1, 'What does faithfulness in a small matter reveal?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '83289ef4-f1e4-5ec5-9e39-69a2415d27a3',
  '740677c9-f560-54d3-acf2-3cd50215ff40', 2, 'How can money become a master rather than a tool?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'a34f0c29-a6d4-57dd-a1ef-ddf05a0fc1f4',
  '740677c9-f560-54d3-acf2-3cd50215ff40', 3, 'What safeguards support trustworthy stewardship in an organization?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '2da14b1a-40cf-53a5-98bd-2acd4dbd1242', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'adults',
  'Christian Relationships', null, 7,
  'not_reviewed', 'draft', 'After describing the church as one body with many members and gifts, Paul gives a series of practical instructions for communal life.',
  'Choose one relationship where you can honour, welcome, or help someone. Where harm continues, seek appropriate boundaries and accountability rather than using “peace” to silence the truth.', 'Romans 12:18',
  'God, form sincere love among us. Help us honour one another, reject evil, welcome others, and seek peace with justice and wisdom. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '4452be11-cba9-52dc-89c0-654444715ba8',
  '2da14b1a-40cf-53a5-98bd-2acd4dbd1242', 1, 'Romans 12:9–18'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'd75d1a2b-20bc-5a46-8c33-760756832fdd',
  '2da14b1a-40cf-53a5-98bd-2acd4dbd1242', 1, 'Identify the practices Paul names for life in the Christian community.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'c18170c8-b171-568b-9804-53ceba89b0b6',
  '2da14b1a-40cf-53a5-98bd-2acd4dbd1242', 2, 'Explain how sincere love includes both honor and moral discernment.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '919aac55-1e5d-5601-bc39-78d7ca0885e1',
  '2da14b1a-40cf-53a5-98bd-2acd4dbd1242', 3, 'Choose one concrete action that promotes peace without denying justice.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '5c54d5ab-3996-56c4-ab11-81c82364a7cd',
  '2da14b1a-40cf-53a5-98bd-2acd4dbd1242', 1, 'teaching_point', 'Love must be sincere',
  'Paul calls for genuine love, hatred of evil, and holding fast to what is good. Christian relationship is not mere politeness; it has moral substance.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'ccbe0435-99fe-5097-9ad8-997419bfe1c5',
  '2da14b1a-40cf-53a5-98bd-2acd4dbd1242', 2, 'teaching_point', 'Honor and hospitality shape community',
  'The passage calls believers to mutual affection, honoring one another, sharing with those in need, and practising hospitality. These habits counter competition and exclusion.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'be3a0f88-ab4f-5364-8375-cc628ed1cfc7',
  '2da14b1a-40cf-53a5-98bd-2acd4dbd1242', 3, 'teaching_point', 'Peace is pursued as far as possible',
  'Paul tells believers not to repay evil for evil, to leave room for God’s justice, and, if possible, so far as it depends on them, to live peaceably with all. Peace is pursued without claiming control over another person’s actions.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'c8687135-eb1d-560b-8513-4b2fe1d96080', '2da14b1a-40cf-53a5-98bd-2acd4dbd1242',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '2195045c-6703-5419-9bb1-f1416ba35e44',
  'c8687135-eb1d-560b-8513-4b2fe1d96080', 1, 'How does sincere love differ from simply avoiding disagreement?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'fa5c99ce-8886-548e-8acf-7e5a83c14dbb',
  'c8687135-eb1d-560b-8513-4b2fe1d96080', 2, 'What does honouring another person look like in a tense relationship?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '2c76fd07-43ae-5beb-9ebd-a0df23e065f7',
  'c8687135-eb1d-560b-8513-4b2fe1d96080', 3, 'What qualifications does Paul place on living peaceably with all?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'd5cf8293-665b-5f15-b46c-1061dec9f4a8', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'adults',
  'Integrity in Daily Life', null, 8,
  'not_reviewed', 'draft', 'Micah 6 uses courtroom language: the Lord brings a case against the people, who ask what offerings they should bring. Verse 8 answers by pointing to a way of life.',
  'Examine one decision involving work, family, money, or community power. Ask who bears the cost, whether the process is fair, and what humble repair or advocacy is possible.', 'Micah 6:8',
  'God, show us what is good. Make us people who do justice, love mercy, and walk humbly with you. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  'cb16e696-839f-553b-a4ab-1cfbf337fbc9',
  'd5cf8293-665b-5f15-b46c-1061dec9f4a8', 1, 'Micah 6:8'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'ae7feb68-fdb4-5aec-a170-70abe1ec593c',
  'd5cf8293-665b-5f15-b46c-1061dec9f4a8', 1, 'Read Micah 6:8 in the context of the people’s question about offerings.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '88043567-b438-5bfb-998e-aa34accb2d8c',
  'd5cf8293-665b-5f15-b46c-1061dec9f4a8', 2, 'Explain justice, mercy, and humble walking with God as connected obligations.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '1da53a4b-ce2b-5338-b516-964999170080',
  'd5cf8293-665b-5f15-b46c-1061dec9f4a8', 3, 'Identify a practical action addressing fairness in daily life.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '78897a99-852f-56bf-bf77-3b867492db3a',
  'd5cf8293-665b-5f15-b46c-1061dec9f4a8', 1, 'teaching_point', 'God has already made the requirement known',
  'The prophet says God has shown what is good. The answer is not a more extravagant religious gift but faithful conduct.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '5f252d5a-7aa1-518c-bcf4-de078e0bb532',
  'd5cf8293-665b-5f15-b46c-1061dec9f4a8', 2, 'teaching_point', 'Do justice',
  'Justice means acting rightly in relationships and public life, not only feeling concern. Micah’s wider message confronts exploitation and corrupt leadership.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '4dd7c43f-15c1-5de7-9102-c6704b698182',
  'd5cf8293-665b-5f15-b46c-1061dec9f4a8', 3, 'teaching_point', 'Love mercy and walk humbly with God',
  'The verse joins steadfast love with justice and humble walking with God. Humility prevents people from claiming moral superiority while neglecting repair and care.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'e7822a58-f855-5d95-9244-48f8bc974e99', 'd5cf8293-665b-5f15-b46c-1061dec9f4a8',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '581c7ff2-dd21-528c-a0e6-053faae76c79',
  'e7822a58-f855-5d95-9244-48f8bc974e99', 1, 'What question about worship does Micah 6:8 answer?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '7b5c72b1-0853-5b84-b06f-a26c3bbfb583',
  'e7822a58-f855-5d95-9244-48f8bc974e99', 2, 'Why does the verse join justice, mercy, and humility?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '3cc5df57-f237-5f58-9d33-3087ea62e082',
  'e7822a58-f855-5d95-9244-48f8bc974e99', 3, 'Where might a small act of justice matter in your community?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '2b02f745-66eb-5241-9dac-3767cfaf47dd', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'adults',
  'Serving With Spiritual Gifts', null, 9,
  'not_reviewed', 'draft', 'Paul has urged believers to offer themselves to God and be transformed. He turns to gifts and describes the church as one body with many members.',
  'Ask trusted people where they see you contributing well, then try one appropriate service role with clear boundaries and accountability. A claimed gift never excuses control or harm.', 'Romans 12:6',
  'God, thank you for the gifts present in your people. Keep us humble, equip our service, and help each gift build up the whole community. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '847282a4-21a8-5b72-8f72-d909ebb698a8',
  '2b02f745-66eb-5241-9dac-3767cfaf47dd', 1, 'Romans 12:3–8'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'ec4965c2-8c3a-52d5-9b65-f761fe455559',
  '2b02f745-66eb-5241-9dac-3767cfaf47dd', 1, 'Explain Paul’s body metaphor and its challenge to individual pride.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'f752672a-7cb0-5529-b216-4c5cfdddd881',
  '2b02f745-66eb-5241-9dac-3767cfaf47dd', 2, 'Identify the gifts listed in Romans 12:6–8.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '02bab3cb-8fc7-5288-98fe-88949ff99f5a',
  '2b02f745-66eb-5241-9dac-3767cfaf47dd', 3, 'Plan service that is accountable, proportionate, and useful to others.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '53d527f2-5424-55f3-adfe-442352e04020',
  '2b02f745-66eb-5241-9dac-3767cfaf47dd', 1, 'teaching_point', 'Think with sober judgment',
  'Paul warns against thinking too highly of oneself and says each person should think with sober judgment according to the measure of faith God has given. Gifts are received, not proof of superiority.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'e69287bb-f422-5bfc-90b5-3af4561b7bff',
  '2b02f745-66eb-5241-9dac-3767cfaf47dd', 2, 'teaching_point', 'One body needs many members',
  'The members have different functions, but belong to one body. Difference is necessary for shared life; no single member is the whole community.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'c012a90a-6f1c-5d77-b0ff-8d0ac22b464b',
  '2b02f745-66eb-5241-9dac-3767cfaf47dd', 3, 'teaching_point', 'Use gifts faithfully for others',
  'Paul lists prophecy, service, teaching, encouragement, giving, leadership, and mercy, each practised in a fitting way. These gifts serve the body and should be exercised with integrity.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'e9a4ffc0-f887-524e-92bb-4dd8ef88b3dc', '2b02f745-66eb-5241-9dac-3767cfaf47dd',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '0d600213-9559-53b6-8882-d9e8dd9fe8f7',
  'e9a4ffc0-f887-524e-92bb-4dd8ef88b3dc', 1, 'Why does Paul connect gifts with sober judgment?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '559b9c68-22be-5c03-9820-7925715d19f3',
  'e9a4ffc0-f887-524e-92bb-4dd8ef88b3dc', 2, 'What does the body image teach about dependence on one another?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'bcefe1be-39d5-5375-9a99-f10b979f9b2f',
  'e9a4ffc0-f887-524e-92bb-4dd8ef88b3dc', 3, 'How can a community test whether a form of leadership is serving well?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'b0e2ee00-9e07-5228-8e16-3654f85397c8', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'adults',
  'Wisdom in Decision-Making', null, 10,
  'not_reviewed', 'draft', 'James has just described trials and the formation of perseverance. In verse 5, he addresses the person who lacks wisdom and invites that person to ask God.',
  'Write down the decision, what is known, what remains uncertain, and who is affected. Pray for wisdom, consult people with relevant expertise, and choose a next step consistent with truth and care.', 'James 1:5',
  'Generous God, give us wisdom for the decisions before us. Help us ask with trust, listen well, and act responsibly toward everyone affected. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  'c649f0df-4ec6-50c1-bee7-88b0d555330d',
  'b0e2ee00-9e07-5228-8e16-3654f85397c8', 1, 'James 1:5'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '2e272e98-aa8d-538b-82c9-c360e4a36204',
  'b0e2ee00-9e07-5228-8e16-3654f85397c8', 1, 'Read James 1:5 in its immediate context about trials and endurance.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '57c0d7b4-1adc-5627-8906-f6fc86d84e15',
  'b0e2ee00-9e07-5228-8e16-3654f85397c8', 2, 'Describe the character of God as generous toward those who ask for wisdom.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '79a1874a-ac44-55dc-9c00-b4361b8bd900',
  'b0e2ee00-9e07-5228-8e16-3654f85397c8', 3, 'Combine prayer with evidence, counsel, and responsibility in a decision.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '44153924-5501-5616-9fb0-248bb2e8467f',
  'b0e2ee00-9e07-5228-8e16-3654f85397c8', 1, 'teaching_point', 'Wisdom is needed in the middle of trials',
  'The verse is connected to the preceding discussion of testing and maturity. The request is for wisdom to live faithfully, not necessarily for secret information about every future event.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '8f70171e-14c7-5665-b3b6-7da306746aa6',
  'b0e2ee00-9e07-5228-8e16-3654f85397c8', 2, 'teaching_point', 'God gives generously',
  'James describes God as giving to all generously and without reproach. The invitation counters the fear that asking for wisdom will be met with contempt.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'a48b0202-1c9a-5e22-af1d-5acf942935f9',
  'b0e2ee00-9e07-5228-8e16-3654f85397c8', 3, 'teaching_point', 'Ask in trust and act responsibly',
  'The verse says wisdom will be given. In context, James also warns against divided allegiance. Trust does not remove the need to seek sound facts, counsel, and accountable action.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '47f6cf48-7875-56ac-a048-ebb6df094728', 'b0e2ee00-9e07-5228-8e16-3654f85397c8',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '9ab22fc5-519c-5030-ba9b-d05bcaf0ce81',
  '47f6cf48-7875-56ac-a048-ebb6df094728', 1, 'What kind of situation surrounds James’ invitation to ask for wisdom?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'c2045e4a-ce64-5824-a0de-5ac46ab84fd4',
  '47f6cf48-7875-56ac-a048-ebb6df094728', 2, 'What does “without reproach” suggest about God’s response?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'f8198b76-5e72-5d13-9808-3c4a2a759d42',
  '47f6cf48-7875-56ac-a048-ebb6df094728', 3, 'How can prayer and careful research work together?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  'f33d094e-2489-52a4-a43f-1820d7bec3d1', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'adults',
  'Compassion for Those in Need', null, 11,
  'not_reviewed', 'draft', 'In Matthew 25:31–46 Jesus describes the Son of Man judging the nations. Verses 31–40 picture the King separating people and explaining that acts toward “the least of these” were acts toward him.',
  'Partner with a reputable local organization, listen to people’s expressed needs, protect privacy, and avoid making help conditional on religious participation or public gratitude.', 'Matthew 25:40',
  'Jesus, open our eyes to people in need. Teach us to offer practical, respectful care and to honor your image in every person. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '85755664-e4f8-5855-be37-737f7c657446',
  'f33d094e-2489-52a4-a43f-1820d7bec3d1', 1, 'Matthew 25:31–40'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '21be354d-70e3-5754-9639-334a9aa97587',
  'f33d094e-2489-52a4-a43f-1820d7bec3d1', 1, 'Summarize the King’s identification with people in need in the passage.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '02c66c26-436b-51db-b079-44011cfdaf7a',
  'f33d094e-2489-52a4-a43f-1820d7bec3d1', 2, 'Identify the concrete acts of care named by Jesus.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '0d0e5f58-ffda-55f6-a228-98c9b712b6a4',
  'f33d094e-2489-52a4-a43f-1820d7bec3d1', 3, 'Plan a respectful response that meets needs without humiliating recipients.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'f345239c-1dff-559e-b487-7553434fbe96',
  'f33d094e-2489-52a4-a43f-1820d7bec3d1', 1, 'teaching_point', 'The King names concrete needs',
  'The passage names hunger, thirst, being a stranger, lack of clothing, sickness, and imprisonment. Compassion is expressed through practical attention to people’s real circumstances.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '6a5b6c9b-cdea-5863-a595-fb0d761233df',
  'f33d094e-2489-52a4-a43f-1820d7bec3d1', 2, 'teaching_point', 'The righteous are surprised',
  'Those welcomed by the King ask when they saw him in need. They did not describe their acts as a strategy for earning status; the King identifies himself with those they served.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'df479b25-0afe-50f6-9d8f-93ffd640a155',
  'f33d094e-2489-52a4-a43f-1820d7bec3d1', 3, 'teaching_point', 'Care for the vulnerable matters to Jesus',
  'The King says what was done for one of the least of these was done for him. The passage makes care for vulnerable people central to the judgment scene.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '18454365-85e6-508b-8711-88b5db8c1e45', 'f33d094e-2489-52a4-a43f-1820d7bec3d1',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '754c2f8d-ef38-513f-baf6-7357a4b396ad',
  '18454365-85e6-508b-8711-88b5db8c1e45', 1, 'Which needs are specifically named in the passage?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'eb0c0df7-afc0-5ebc-8a43-b20082188701',
  '18454365-85e6-508b-8711-88b5db8c1e45', 2, 'Why are the righteous surprised by the King’s explanation?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  '0339b559-ff20-5823-b8cc-b50dd9445d71',
  '18454365-85e6-508b-8711-88b5db8c1e45', 3, 'What safeguards make charitable help dignified and accountable?'
)
on conflict (id) do nothing;

insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  '6bcb0ec1-dc06-51fa-9618-b075e143767d', '34ddb9fd-953c-55ed-bb84-9cb9d433052f', 'adults',
  'Perseverance in Faith', null, 12,
  'not_reviewed', 'draft', 'Hebrews 12 follows the account of faithful people in chapter 11. The author uses an athletic image to encourage a community facing weariness and opposition.',
  'Name one practice that strengthens faith and one avoidable burden that drains attention. Seek a realistic support plan with others; perseverance is not isolation or refusal to rest.', 'Hebrews 12:1–2',
  'Jesus, help us run with perseverance. Show us what to lay aside, give us companions for the journey, and renew us when we grow weary. Amen.', null,
  null, null
)
on conflict (id) do nothing;

insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  '3635734a-1478-505a-b52f-38c1ae572b72',
  '6bcb0ec1-dc06-51fa-9618-b075e143767d', 1, 'Hebrews 12:1–3'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  '2a052b1d-90ea-510c-94a4-a20d978fb837',
  '6bcb0ec1-dc06-51fa-9618-b075e143767d', 1, 'Explain the race imagery and the role of witnesses in Hebrews 12.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'ef8b84d3-ebf3-59a1-86e0-247d09204e1a',
  '6bcb0ec1-dc06-51fa-9618-b075e143767d', 2, 'Identify what believers are told to lay aside and where to fix their attention.'
)
on conflict (id) do nothing;

insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  'b40098ec-030b-5da5-91ed-72af6d05f538',
  '6bcb0ec1-dc06-51fa-9618-b075e143767d', 3, 'Develop a sustainable practice for continuing through discouragement.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'f62889fe-cd0b-539a-bfd1-0e6cacf0f791',
  '6bcb0ec1-dc06-51fa-9618-b075e143767d', 1, 'teaching_point', 'A great cloud of witnesses surrounds the race',
  'The witnesses of chapter 11 give testimony to faith. The image encourages the readers as they run the race set before them.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  'e6fbe5de-be29-5193-8cfa-8943cfbb00aa',
  '6bcb0ec1-dc06-51fa-9618-b075e143767d', 2, 'teaching_point', 'Lay aside hindrances and sin',
  'The passage calls believers to throw off everything that hinders and the sin that entangles, and to run with perseverance. Some burdens require support and patience to address.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '4fbd2714-173b-5dac-9ac1-cb2d622772aa',
  '6bcb0ec1-dc06-51fa-9618-b075e143767d', 3, 'teaching_point', 'Fix attention on Jesus',
  'Jesus is described as the pioneer and perfecter of faith, who endured the cross and hostility. Verse 3 tells readers to consider him so they will not grow weary or lose heart.'
)
on conflict (id) do nothing;

insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  '5c5b017e-f152-5f9e-abd8-1239b7a99a50', '6bcb0ec1-dc06-51fa-9618-b075e143767d',
  4, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'a8510429-f3ee-5f1f-b7a0-50df1add93a5',
  '5c5b017e-f152-5f9e-abd8-1239b7a99a50', 1, 'Who are the witnesses referred to by the previous chapter?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'b8a81844-f55c-5c86-b51c-287e042d181b',
  '5c5b017e-f152-5f9e-abd8-1239b7a99a50', 2, 'What does the passage ask runners to lay aside?'
)
on conflict (id) do nothing;

insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  'ae293811-8ba6-5211-baa0-4c38c14f9529',
  '5c5b017e-f152-5f9e-abd8-1239b7a99a50', 3, 'How can considering Jesus help without denying exhaustion or grief?'
)
on conflict (id) do nothing;

commit;
