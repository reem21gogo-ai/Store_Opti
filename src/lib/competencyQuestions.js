// Competency Assessment Questions
// 5 questions per domain × 6 domains = 30 total
// Quick version: first 3 per domain (18 questions)
// Full version: all 5 per domain (30 questions)

export const ALL_QUESTIONS = [
  // DOMAIN 1: Thought & Analysis
  { id:'q1_1', domain:'thought_analysis', sub_competency:'critical_thinking', weight:1,
    text:{ ar:'عندما تواجه مشكلة معقدة في العمل، ما هو نهجك الأول؟', en:'When facing a complex problem at work, what is your first approach?' },
    options:[
      { id:'a', text:{ ar:'أتصرف بناءً على حدسي مباشرةً', en:'Act based on my intuition immediately' }, score:1 },
      { id:'b', text:{ ar:'أجمع المعلومات الأساسية وأفكر', en:'Gather basic info and think before acting' }, score:2 },
      { id:'c', text:{ ar:'أحلل الوضع وأستكشف خيارات متعددة', en:'Analyze the situation and explore multiple options' }, score:3 },
      { id:'d', text:{ ar:'أحلل منهجيًا وأضع معايير تقييم واضحة للحلول', en:'Systematically analyze and set clear evaluation criteria for solutions' }, score:4 },
    ] },
  { id:'q1_2', domain:'thought_analysis', sub_competency:'problem_solving', weight:1,
    text:{ ar:'كيف تتعامل عادةً مع مشكلة طارئة لم تواجهها من قبل؟', en:'How do you handle an unexpected problem you\'ve never faced before?' },
    options:[
      { id:'a', text:{ ar:'أنتظر حتى يأتي حل من تلقاء نفسه', en:'Wait and hope a solution appears' }, score:1 },
      { id:'b', text:{ ar:'أسأل زملائي كيف تعاملوا مع مشكلات مشابهة', en:'Ask colleagues how they handled similar issues' }, score:2 },
      { id:'c', text:{ ar:'أجرّب حلولًا متعددة وأقيّم النتائج', en:'Try multiple solutions and evaluate results' }, score:3 },
      { id:'d', text:{ ar:'أفهم جذر المشكلة وأبني حلًا منهجيًا', en:'Understand the root cause and build a systematic solution' }, score:4 },
    ] },
  { id:'q1_3', domain:'thought_analysis', sub_competency:'decision_making', weight:1,
    text:{ ar:'عندما تحتاج إلى اتخاذ قرار مهم بسرعة، ماذا تفعل؟', en:'When you need to make an important decision quickly, what do you do?' },
    options:[
      { id:'a', text:{ ar:'أتجنب القرار قدر الإمكان', en:'Avoid the decision as much as possible' }, score:1 },
      { id:'b', text:{ ar:'أختار أول خيار يبدو معقولًا', en:'Choose the first option that seems reasonable' }, score:2 },
      { id:'c', text:{ ar:'أفكر بسرعة في خيارين أو ثلاثة وأختار الأفضل', en:'Quickly think of two or three options and choose the best' }, score:3 },
      { id:'d', text:{ ar:'أقيّم الخيارات بسرعة مع تحديد المخاطر لكل منها', en:'Quickly evaluate options while identifying risks for each' }, score:4 },
    ] },
  { id:'q1_4', domain:'thought_analysis', sub_competency:'critical_thinking', weight:1,
    text:{ ar:'كيف تتحقق من صحة المعلومات قبل الاعتماد عليها؟', en:'How do you verify information before relying on it?' },
    options:[
      { id:'a', text:{ ar:'أعتمد على أي معلومة تُقدَّم لي', en:'Accept any information presented to me' }, score:1 },
      { id:'b', text:{ ar:'أعتمد على مصادر أثق بها فقط', en:'Rely only on sources I trust' }, score:2 },
      { id:'c', text:{ ar:'أتحقق من المعلومة من مصدرين مختلفين', en:'Verify information from two different sources' }, score:3 },
      { id:'d', text:{ ar:'أتحقق بشكل منهجي وأقيّم موثوقية المصادر', en:'Verify systematically and evaluate source reliability' }, score:4 },
    ] },
  { id:'q1_5', domain:'thought_analysis', sub_competency:'decision_making', weight:1,
    text:{ ar:'كيف تتعامل مع القرارات التي تنطوي على عدم يقين؟', en:'How do you handle decisions that involve uncertainty?' },
    options:[
      { id:'a', text:{ ar:'أتجنب القرار حتى تتضح الأمور تمامًا', en:'Avoid deciding until things are completely clear' }, score:1 },
      { id:'b', text:{ ar:'أتخذ القرار وأتعامل مع النتائج لاحقًا', en:'Decide and deal with outcomes later' }, score:2 },
      { id:'c', text:{ ar:'أحدد أهم المخاطر ثم أقرر', en:'Identify key risks then decide' }, score:3 },
      { id:'d', text:{ ar:'أحلل السيناريوهات المحتملة وأضع خطة للحالات الطارئة', en:'Analyze possible scenarios and create contingency plans' }, score:4 },
    ] },

  // DOMAIN 2: Results & Execution
  { id:'q2_1', domain:'results_execution', sub_competency:'prioritization', weight:1,
    text:{ ar:'كيف تتعامل مع تعارض الأولويات في العمل؟', en:'How do you handle conflicting priorities at work?' },
    options:[
      { id:'a', text:{ ar:'أنجز المهام حسب ترتيب ورودها', en:'Complete tasks in the order they arrive' }, score:1 },
      { id:'b', text:{ ar:'أركز على المهام العاجلة فقط', en:'Focus only on urgent tasks' }, score:2 },
      { id:'c', text:{ ar:'أصنّف المهام حسب الأهمية والإلحاح', en:'Classify tasks by importance and urgency' }, score:3 },
      { id:'d', text:{ ar:'أستخدم إطارًا واضحًا لترتيب الأولويات وأراجعه دوريًا', en:'Use a clear prioritization framework and review it regularly' }, score:4 },
    ] },
  { id:'q2_2', domain:'results_execution', sub_competency:'goal_setting', weight:1,
    text:{ ar:'كيف تضع أهدافك المهنية؟', en:'How do you set your professional goals?' },
    options:[
      { id:'a', text:{ ar:'ليس لدي أهداف محددة', en:'I don\'t have specific goals' }, score:1 },
      { id:'b', text:{ ar:'أضع أهدافًا عامة في ذهني', en:'I keep general goals in mind' }, score:2 },
      { id:'c', text:{ ar:'أضع أهدافًا مكتوبة ومحددة', en:'I set written and specific goals' }, score:3 },
      { id:'d', text:{ ar:'أضع أهدافًا SMART وأتتبع تقدمي نحوها بانتظام', en:'I set SMART goals and track my progress regularly' }, score:4 },
    ] },
  { id:'q2_3', domain:'results_execution', sub_competency:'follow_through', weight:1,
    text:{ ar:'ما مدى التزامك بإنجاز المهام في المواعيد المحددة؟', en:'How consistent are you in completing tasks on time?' },
    options:[
      { id:'a', text:{ ar:'نادرًا ما أنجز المهام في المواعيد', en:'I rarely complete tasks on time' }, score:1 },
      { id:'b', text:{ ar:'أحيانًا أنجز في الموعد، وأحيانًا أتأخر', en:'Sometimes on time, sometimes delayed' }, score:2 },
      { id:'c', text:{ ar:'في الغالب أنجز في الموعد', en:'I usually meet deadlines' }, score:3 },
      { id:'d', text:{ ar:'أنجز دائمًا في الموعد وأخطط للطوارئ مسبقًا', en:'I always meet deadlines and plan for contingencies in advance' }, score:4 },
    ] },
  { id:'q2_4', domain:'results_execution', sub_competency:'goal_setting', weight:1,
    text:{ ar:'كيف تعرف إذا كنت تسير في الاتجاه الصحيح في عملك؟', en:'How do you know if you\'re moving in the right direction in your work?' },
    options:[
      { id:'a', text:{ ar:'أعتمد على شعوري العام', en:'I rely on my general feeling' }, score:1 },
      { id:'b', text:{ ar:'أنتظر تقييم المشرف', en:'I wait for my supervisor\'s evaluation' }, score:2 },
      { id:'c', text:{ ar:'أراجع نتائج عملي بشكل دوري', en:'I review my work results periodically' }, score:3 },
      { id:'d', text:{ ar:'أضع مؤشرات أداء واضحة وأتابعها أسبوعيًا', en:'I set clear KPIs and follow them weekly' }, score:4 },
    ] },
  { id:'q2_5', domain:'results_execution', sub_competency:'follow_through', weight:1,
    text:{ ar:'ماذا تفعل عندما تواجه عقبة تمنعك من إنجاز مهمة؟', en:'What do you do when you face an obstacle preventing task completion?' },
    options:[
      { id:'a', text:{ ar:'أتوقف وأنتظر حتى تُحل العقبة', en:'Stop and wait for the obstacle to be resolved' }, score:1 },
      { id:'b', text:{ ar:'أُبلّغ المشرف وأنتظر تعليماته', en:'Inform my supervisor and wait for instructions' }, score:2 },
      { id:'c', text:{ ar:'أبحث عن حل بديل بنفسي', en:'Look for an alternative solution myself' }, score:3 },
      { id:'d', text:{ ar:'أبادر بالحلول البديلة مع إخطار المعنيين وتوثيق الموقف', en:'Proactively seek solutions, notify relevant parties, and document the situation' }, score:4 },
    ] },

  // DOMAIN 3: People & Collaboration
  { id:'q3_1', domain:'people_collaboration', sub_competency:'communication', weight:1,
    text:{ ar:'كيف تتأكد من أن الآخرين فهموا ما قلته؟', en:'How do you ensure others have understood what you said?' },
    options:[
      { id:'a', text:{ ar:'أفترض أنهم فهموا', en:'I assume they understood' }, score:1 },
      { id:'b', text:{ ar:'أسأل إذا كان عندهم أسئلة', en:'Ask if they have questions' }, score:2 },
      { id:'c', text:{ ar:'أطلب منهم إعادة صياغة ما فهموه', en:'Ask them to paraphrase what they understood' }, score:3 },
      { id:'d', text:{ ar:'أتحقق من الفهم وأعدّل رسالتي وفق المستمع', en:'Verify understanding and adjust my message to the listener' }, score:4 },
    ] },
  { id:'q3_2', domain:'people_collaboration', sub_competency:'teamwork', weight:1,
    text:{ ar:'كيف تتعامل مع خلافات الفريق؟', en:'How do you handle team conflicts?' },
    options:[
      { id:'a', text:{ ar:'أتجنب التدخل', en:'Avoid involvement' }, score:1 },
      { id:'b', text:{ ar:'أحيل الأمر للمدير', en:'Escalate to the manager' }, score:2 },
      { id:'c', text:{ ar:'أتحدث مع الأطراف المعنية بشكل منفصل', en:'Talk to involved parties separately' }, score:3 },
      { id:'d', text:{ ar:'أتوسط بموضوعية وأساعد على إيجاد حل مشترك', en:'Mediate objectively and help find a mutual solution' }, score:4 },
    ] },
  { id:'q3_3', domain:'people_collaboration', sub_competency:'conflict_resolution', weight:1,
    text:{ ar:'كيف تتعامل مع زميل صعب المعاملة؟', en:'How do you deal with a difficult colleague?' },
    options:[
      { id:'a', text:{ ar:'أتجنبه قدر الإمكان', en:'Avoid them as much as possible' }, score:1 },
      { id:'b', text:{ ar:'أشكو منه للمدير', en:'Complain about them to the manager' }, score:2 },
      { id:'c', text:{ ar:'أتحدث معه مباشرة عن ما يزعجني', en:'Talk to them directly about what bothers me' }, score:3 },
      { id:'d', text:{ ar:'أحاول فهم منظوره وأبني جسر تواصل بيننا', en:'Try to understand their perspective and build a communication bridge' }, score:4 },
    ] },
  { id:'q3_4', domain:'people_collaboration', sub_competency:'communication', weight:1,
    text:{ ar:'كيف تتصرف عندما تختلف مع رأي زميلك في اجتماع؟', en:'How do you act when you disagree with a colleague\'s opinion in a meeting?' },
    options:[
      { id:'a', text:{ ar:'أصمت ولا أبدي رأيي', en:'Stay silent and don\'t share my opinion' }, score:1 },
      { id:'b', text:{ ar:'أُعرب عن اعتراضي مباشرةً دون شرح', en:'Express my objection directly without explanation' }, score:2 },
      { id:'c', text:{ ar:'أشرح وجهة نظري بأدب وأستمع لوجهة نظره', en:'Politely share my view and listen to theirs' }, score:3 },
      { id:'d', text:{ ar:'أُعبّر باحترام وأدعو للنقاش البنّاء للوصول لأفضل حل', en:'Express respectfully and invite constructive discussion for the best solution' }, score:4 },
    ] },
  { id:'q3_5', domain:'people_collaboration', sub_competency:'teamwork', weight:1,
    text:{ ar:'كيف تتصرف عندما يحتاج زميل لمساعدتك وأنت مشغول؟', en:'How do you react when a colleague needs your help and you\'re busy?' },
    options:[
      { id:'a', text:{ ar:'أرفض المساعدة لأنني مشغول', en:'Refuse because I\'m busy' }, score:1 },
      { id:'b', text:{ ar:'أساعده إذا كان الأمر سريعًا فقط', en:'Help only if it\'s quick' }, score:2 },
      { id:'c', text:{ ar:'أحدد وقتًا مناسبًا لمساعدته لاحقًا', en:'Schedule a suitable time to help them later' }, score:3 },
      { id:'d', text:{ ar:'أشرح وضعي وأتفق معه على الأسلوب الأفضل لمساعدته', en:'Explain my situation and agree on the best way to help' }, score:4 },
    ] },

  // DOMAIN 4: Self-Leadership & Growth
  { id:'q4_1', domain:'self_leadership', sub_competency:'self_awareness', weight:1,
    text:{ ar:'كيف تواجه الفشل أو الأخطاء في العمل؟', en:'How do you face failures or mistakes at work?' },
    options:[
      { id:'a', text:{ ar:'أشعر بالإحباط وأتجنب التفكير في الموضوع', en:'Feel frustrated and avoid thinking about it' }, score:1 },
      { id:'b', text:{ ar:'أعترف بالخطأ وأمضي قدمًا', en:'Acknowledge the mistake and move on' }, score:2 },
      { id:'c', text:{ ar:'أحلل ما حدث وأستخلص دروسًا', en:'Analyze what happened and draw lessons' }, score:3 },
      { id:'d', text:{ ar:'أتقبّله كفرصة تعلم وأوثّق الدروس لتطبيقها مستقبلًا', en:'Accept it as a learning opportunity and document lessons for future application' }, score:4 },
    ] },
  { id:'q4_2', domain:'self_leadership', sub_competency:'initiative', weight:1,
    text:{ ar:'كيف تتصرف عندما ترى فرصة لتحسين عمل دون أن يُطلب منك ذلك؟', en:'How do you act when you see an opportunity to improve something without being asked?' },
    options:[
      { id:'a', text:{ ar:'أترك الأمر لمن هو مسؤول', en:'Leave it to whoever is responsible' }, score:1 },
      { id:'b', text:{ ar:'أذكر الفرصة لمشرفي فقط', en:'Only mention it to my supervisor' }, score:2 },
      { id:'c', text:{ ar:'أقترح التحسين وأعرض المساعدة في تنفيذه', en:'Suggest the improvement and offer to help implement it' }, score:3 },
      { id:'d', text:{ ar:'أبادر بوضع خطة عملية وأتولى قيادة التحسين', en:'Proactively create an action plan and lead the improvement' }, score:4 },
    ] },
  { id:'q4_3', domain:'self_leadership', sub_competency:'learning_orientation', weight:1,
    text:{ ar:'كيف تحافظ على تطور مهاراتك المهنية؟', en:'How do you keep your professional skills developing?' },
    options:[
      { id:'a', text:{ ar:'لا أفعل شيئًا محددًا في هذا الشأن', en:'I don\'t do anything specific' }, score:1 },
      { id:'b', text:{ ar:'أشارك في التدريبات الإلزامية فقط', en:'Only participate in mandatory training' }, score:2 },
      { id:'c', text:{ ar:'أبحث بانتظام عن فرص تعليمية في مجالي', en:'Regularly look for learning opportunities in my field' }, score:3 },
      { id:'d', text:{ ar:'أضع خطة تطوير ذاتي سنوية وأتتبعها باستمرار', en:'Create an annual self-development plan and track it continuously' }, score:4 },
    ] },
  { id:'q4_4', domain:'self_leadership', sub_competency:'self_awareness', weight:1,
    text:{ ar:'كيف تتعامل مع النقد أو التغذية الراجعة السلبية؟', en:'How do you handle criticism or negative feedback?' },
    options:[
      { id:'a', text:{ ar:'أتجاهله أو أتضايق منه', en:'Ignore it or get upset' }, score:1 },
      { id:'b', text:{ ar:'أقبله شكلًا لكن لا أغيّر سلوكي', en:'Accept it formally but don\'t change my behavior' }, score:2 },
      { id:'c', text:{ ar:'أستمع وأحاول تطبيق ما هو منطقي منه', en:'Listen and try to apply what makes sense' }, score:3 },
      { id:'d', text:{ ar:'أشكره، أحلله بموضوعية، وأضع خطة تحسين', en:'Thank them, analyze it objectively, and create an improvement plan' }, score:4 },
    ] },
  { id:'q4_5', domain:'self_leadership', sub_competency:'initiative', weight:1,
    text:{ ar:'ما مدى وعيك بنقاط قوتك ومجالات تطويرك؟', en:'How aware are you of your strengths and development areas?' },
    options:[
      { id:'a', text:{ ar:'لست متأكدًا من قوتي أو ضعفي المهني', en:'Not sure about my professional strengths or weaknesses' }, score:1 },
      { id:'b', text:{ ar:'أعرف بعضها بشكل عام', en:'I know some of them generally' }, score:2 },
      { id:'c', text:{ ar:'أعرف نقاطًا محددة وأعمل على تطويرها', en:'I know specific points and work to develop them' }, score:3 },
      { id:'d', text:{ ar:'لدي صورة واضحة ومحدّثة وأبني عليها خطة تطوير', en:'Have a clear, updated picture and build a development plan on it' }, score:4 },
    ] },

  // DOMAIN 5: Customer & Stakeholder Value
  { id:'q5_1', domain:'customer_value', sub_competency:'customer_focus', weight:1,
    text:{ ar:'كيف تتعامل مع طلب من عميل لا تستطيع تلبيته تمامًا؟', en:'How do you handle a request from a customer you can\'t fully fulfill?' },
    options:[
      { id:'a', text:{ ar:'أخبره برفض مباشر', en:'Tell them no directly' }, score:1 },
      { id:'b', text:{ ar:'أخبره أنه ليس في صلاحياتي', en:'Tell them it\'s not within my authority' }, score:2 },
      { id:'c', text:{ ar:'أعتذر وأشرح له الأسباب', en:'Apologize and explain the reasons' }, score:3 },
      { id:'d', text:{ ar:'أشرح القيود، أقدم بديلًا، وأتابع رضاه', en:'Explain limitations, offer an alternative, and follow up on their satisfaction' }, score:4 },
    ] },
  { id:'q5_2', domain:'customer_value', sub_competency:'stakeholder_mgmt', weight:1,
    text:{ ar:'كيف تتأكد من أن عملك يلبي توقعات المستفيدين؟', en:'How do you ensure your work meets stakeholder expectations?' },
    options:[
      { id:'a', text:{ ar:'أفترض أنني أعرف ما يريدون', en:'Assume I know what they want' }, score:1 },
      { id:'b', text:{ ar:'أنتظر مراجعة رئيسي للعمل', en:'Wait for my supervisor to review the work' }, score:2 },
      { id:'c', text:{ ar:'أسأل المستفيدين عن توقعاتهم في البداية', en:'Ask stakeholders about expectations at the start' }, score:3 },
      { id:'d', text:{ ar:'أحدد التوقعات مسبقًا وأتحقق دوريًا من الرضا', en:'Define expectations upfront and periodically check satisfaction' }, score:4 },
    ] },
  { id:'q5_3', domain:'customer_value', sub_competency:'service_quality', weight:1,
    text:{ ar:'عندما تتلقى شكوى، كيف تتعامل معها؟', en:'When you receive a complaint, how do you handle it?' },
    options:[
      { id:'a', text:{ ar:'أحيلها لشخص آخر', en:'Pass it on to someone else' }, score:1 },
      { id:'b', text:{ ar:'أبرر وأدافع عن موقفي', en:'Justify and defend my position' }, score:2 },
      { id:'c', text:{ ar:'أستمع وأحاول إيجاد حل', en:'Listen and try to find a solution' }, score:3 },
      { id:'d', text:{ ar:'أستمع بإنصات، أعتذر عند الاقتضاء، أحل المشكلة، وأتابع النتيجة', en:'Listen attentively, apologize when appropriate, solve the problem, and follow up' }, score:4 },
    ] },
  { id:'q5_4', domain:'customer_value', sub_competency:'customer_focus', weight:1,
    text:{ ar:'كيف تتعرف على احتياجات العملاء أو المستفيدين من عملك؟', en:'How do you identify the needs of customers or work beneficiaries?' },
    options:[
      { id:'a', text:{ ar:'لا أفكر في ذلك، أؤدي عملي فقط', en:'Don\'t think about it — just do my job' }, score:1 },
      { id:'b', text:{ ar:'أتعرف على احتياجاتهم عند وجود مشكلة', en:'Learn their needs when a problem arises' }, score:2 },
      { id:'c', text:{ ar:'أسألهم بشكل دوري عما يحتاجونه', en:'Ask them periodically about their needs' }, score:3 },
      { id:'d', text:{ ar:'أبني علاقة مستمرة أفهم من خلالها احتياجاتهم المتطورة', en:'Build an ongoing relationship to understand their evolving needs' }, score:4 },
    ] },
  { id:'q5_5', domain:'customer_value', sub_competency:'service_quality', weight:1,
    text:{ ar:'ما مستوى اهتمامك بجودة عملك قبل تسليمه؟', en:'How attentive are you to the quality of your work before delivering it?' },
    options:[
      { id:'a', text:{ ar:'أسلّم ما تم دون مراجعة', en:'Deliver what\'s done without review' }, score:1 },
      { id:'b', text:{ ar:'أراجعه إذا كان لدي وقت', en:'Review it if I have time' }, score:2 },
      { id:'c', text:{ ar:'أراجعه دومًا قبل التسليم', en:'Always review before delivery' }, score:3 },
      { id:'d', text:{ ar:'أراجعه بمعايير محددة وأطلب رأيًا آخر إذا لزم', en:'Review with defined standards and seek a second opinion when needed' }, score:4 },
    ] },

  // DOMAIN 6: Digital, Sustainability & Compliance
  { id:'q6_1', domain:'digital_compliance', sub_competency:'digital_literacy', weight:1,
    text:{ ar:'كيف تتعامل مع التقنيات الجديدة في بيئة عملك؟', en:'How do you approach new technologies in your work environment?' },
    options:[
      { id:'a', text:{ ar:'أتجنبها وأعمل بالطريقة التقليدية', en:'Avoid them and stick to traditional ways' }, score:1 },
      { id:'b', text:{ ar:'أستخدمها فقط عندما يُجبرني الآخرون', en:'Use them only when forced by others' }, score:2 },
      { id:'c', text:{ ar:'أتعلمها وأدمجها في عملي تدريجيًا', en:'Learn them and gradually integrate into my work' }, score:3 },
      { id:'d', text:{ ar:'أبادر باستكشافها وأُشجّع الآخرين على تبنّيها', en:'Proactively explore them and encourage others to adopt them' }, score:4 },
    ] },
  { id:'q6_2', domain:'digital_compliance', sub_competency:'compliance', weight:1,
    text:{ ar:'كيف تتعامل مع سياسات وأنظمة مؤسستك؟', en:'How do you approach your organization\'s policies and regulations?' },
    options:[
      { id:'a', text:{ ar:'أتجاهلها إذا لم تناسبني', en:'Ignore them if they don\'t suit me' }, score:1 },
      { id:'b', text:{ ar:'أتبعها فقط عندما يُراقبني أحد', en:'Follow them only when being observed' }, score:2 },
      { id:'c', text:{ ar:'ألتزم بها في معظم الأحيان', en:'Adhere to them most of the time' }, score:3 },
      { id:'d', text:{ ar:'ألتزم بها دائمًا وأُشجّع الآخرين على الامتثال', en:'Always adhere to them and encourage others to comply' }, score:4 },
    ] },
  { id:'q6_3', domain:'digital_compliance', sub_competency:'sustainability', weight:1,
    text:{ ar:'كيف تأخذ الاستدامة في الاعتبار في قراراتك اليومية؟', en:'How do you consider sustainability in your daily decisions?' },
    options:[
      { id:'a', text:{ ar:'لا أفكر في ذلك على الإطلاق', en:'Don\'t think about it at all' }, score:1 },
      { id:'b', text:{ ar:'أفكر فيها أحيانًا عندما تُذكر', en:'Think about it sometimes when it\'s mentioned' }, score:2 },
      { id:'c', text:{ ar:'أسعى لتقليل الهدر والأثر السلبي في عملي', en:'Try to reduce waste and negative impact in my work' }, score:3 },
      { id:'d', text:{ ar:'أدمج الاستدامة في تفكيري وأُشجّع على ممارساتها', en:'Integrate sustainability into my thinking and encourage its practices' }, score:4 },
    ] },
  { id:'q6_4', domain:'digital_compliance', sub_competency:'digital_literacy', weight:1,
    text:{ ar:'كيف تحافظ على أمن المعلومات في بيئة عملك؟', en:'How do you maintain information security in your work environment?' },
    options:[
      { id:'a', text:{ ar:'لا أهتم بذلك', en:'I don\'t pay attention to that' }, score:1 },
      { id:'b', text:{ ar:'أتبع الإجراءات المطلوبة فقط', en:'Follow only the required procedures' }, score:2 },
      { id:'c', text:{ ar:'أتبع الإجراءات وأتعلم عن التهديدات الشائعة', en:'Follow procedures and learn about common threats' }, score:3 },
      { id:'d', text:{ ar:'أتبنى ممارسات أمنية استباقية وأُنبّه زملائي للمخاطر', en:'Adopt proactive security practices and alert colleagues to risks' }, score:4 },
    ] },
  { id:'q6_5', domain:'digital_compliance', sub_competency:'compliance', weight:1,
    text:{ ar:'ماذا تفعل عندما تلاحظ مخالفة للسياسات في مكان عملك؟', en:'What do you do when you notice a policy violation at work?' },
    options:[
      { id:'a', text:{ ar:'لا أتدخل وأتجاهل الأمر', en:'Don\'t get involved and ignore it' }, score:1 },
      { id:'b', text:{ ar:'أذكر الأمر فقط إذا سُئلت عنه', en:'Mention it only if asked about it' }, score:2 },
      { id:'c', text:{ ar:'أُبلّغ المسؤول عن ذلك', en:'Report it to the person responsible' }, score:3 },
      { id:'d', text:{ ar:'أُبلّغ المسؤول بموضوعية وأُقدّم اقتراحًا لمنع تكراره', en:'Report objectively and offer a suggestion to prevent recurrence' }, score:4 },
    ] },
];

export const getQuestionsForVersion = (version) => {
  const domainOrder = ['thought_analysis','results_execution','people_collaboration','self_leadership','customer_value','digital_compliance'];
  const count = version === 'quick' ? 3 : 5;
  const result = [];
  domainOrder.forEach(domainId => {
    const qs = ALL_QUESTIONS.filter(q => q.domain === domainId);
    result.push(...qs.slice(0, count));
  });
  return result;
};