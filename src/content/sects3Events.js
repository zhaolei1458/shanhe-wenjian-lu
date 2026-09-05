// 六期 v6.0：新十四派拜师考验。照 sects2Events.js 格式：sect_join 效果入册。
import { EVENTS } from './events.js';

Object.assign(EVENTS, {
  ev_kaoyan_shipai: {
    id: 'ev_kaoyan_shipai', weight: 5, nodes: ['cl_chuanwu'], kind: 'sect',
    text: '船行老大领你到码头的旧船前："船行收人不考水性——考你离船的次序。船上装着货、你、我、一个不会水的客人，船要沉了。你先救谁？"',
    options: [
      { label: '先扶客人上救生小船，再和老大抢货', effect: { sect_join: 'canglan_shipai', trait: { yi: 1 } }, text_after: '船老大咧嘴笑了："客人先走，货最后抢——抢得回来是本事，抢不回来是命。对了！船老大呢？船老大在船上掌舵，最后一个离——你现在还不懂这个，上了船就懂了。跟我来。"' },
      { label: '先抢货。货是船行的命', effect: { trait: { chi: 1 } }, text_after: '船老大摇头："货是命？那客人和我们这几条命，是虾米？船行宁赔货，不赔人——这规矩你记不住，甲板就不是你站的。"他转身回了船舱。' },
      { label: '"都救不了才最常见——先放救生筏。"', effect: { sect_join: 'canglan_shipai', trait: { xin: 1 } }, text_after: '船老大愣了一下，大笑："好！先放筏——筏子放下去，怎么救都有个底。你们这些小聪明，我就服『先想到底』的！上船！"' },
    ],
  },
  ev_kaoyan_shuiban: {
    id: 'ev_kaoyan_shuiban', weight: 5, nodes: ['lj_caobang'], kind: 'sect',
    text: '行老把一根长篙递给你，指向江心的一根木桩："驳行收人，就考这一篙——把船稳稳点在桩边，不碰桩。你有一炷香的时候在岸上练。练完，上船。"',
    options: [
      { label: '认认真真练满一炷香再上船', cond: { minWuxing: 40, deny: '一炷香里你练了上百篙，胳膊都抬不起来了。行老拦住你："不是力气的事——你的手太急。回去养养性子，明年再来。"' }, effect: { sect_join: 'linjiang_shuiban', trait: { xin: 1 } }, text_after: '你上船，一篙点出，船稳稳贴在桩边——离桩三寸，纹丝不动。行老眯眼："练没练，篙知道。收了。从明天起，你跟船。"' },
      { label: '直接上船——"水上的事，水里学。"', effect: { trait: { ao: 1 } }, text_after: '你一篙点空，船头结结实实撞在桩上。行老看着船头的白印："水里的事水里学，不假。可撞坏了船，赔的是全行的饭——滚回去练。篙不收手急的人。"' },
    ],
  },
  ev_kaoyan_shougu: {
    id: 'ev_kaoyan_shougu', weight: 5, nodes: ['hq_luanzangling'], kind: 'sect',
    text: '守岭人指着岭上一座无名新坟："收骨人收人，先问你一件最不像本事的事——这底下的人，你一个都不认识。你给他立牌，牌上写什么？"',
    options: [
      { label: '"写『某氏之墓』——生卒不知，来历不知，但他是人。"', effect: { sect_join: 'luanzang_shougu', trait: { ren: 1 } }, text_after: '守岭人重重点头："对喽。收骨人给的是『人』的体面，不是『谁』的体面。岭上三千块无名牌，块块都是这么写的。来，先学着刨土——刨得慢，是对土底下的人客气。"' },
      { label: '"写『无名』就好，何必费神。"', effect: { trait: { chi: 1 } }, text_after: '守岭人盯着你看了很久："『无名』两个字，也是牌。可你说的『何必』——收骨人最怕的就是这两个字。岭上的风把人的名字都吹没了，我们要是也嫌费神，这世上就真没人记得他们了。你去别处谋生吧。"' },
      { label: '"我写不下手——我连他的死都没送过。"', effect: { sect_join: 'luanzang_shougu', trait: { xin: 1 } }, text_after: '守岭人竟然笑了："怕写不好，就是心里有敬意。好——心里有敬的人，笔就不会歪。牌跟我来写，土你自己刨。收骨人的第一课，是『不敢』。"' },
    ],
  },
  ev_kaoyan_baigong: {
    id: 'ev_kaoyan_baigong', weight: 5, nodes: ['sipailou'], kind: 'sect',
    text: '馆主把一块歪歪扭扭的木料放在你面前："百工馆收人，只考一样——这木料是块废料。你拿它做什么？"',
    options: [
      { label: '"当笔架。歪有歪的用处。"', effect: { sect_join: 'tianqi_baigong', trait: { cha: 1 } }, text_after: '馆主抚掌："妙！百工馆收的从来不是巧手——巧手满街都是，缺的是看得出『歪的用处』的眼。收了。你的第一门课是磨一刀：磨三年。别急，三年后你就懂了。"' },
      { label: '"烧了它。废料就是废料。"', effect: { trait: { hen: 1 } }, text_after: '馆主叹气："干净利落，是个爽快人。但百工馆养不起爽快人——爽快人看什么都是废料。这木料是块金丝楠的边角，我故意削歪的。你走吧，去吃爽快的饭。"' },
      { label: '不答，拿起来翻来覆去地看', cond: { minWuxing: 45, deny: '你翻了半天，馆主笑着摇头："看是看了，可惜没看进去。手艺人的眼睛是养出来的——回去养三年。"' }, effect: { sect_join: 'tianqi_baigong', trait: { xin: 1 } }, text_after: '你翻到第三面停住了："这不是废料——木纹走向没断，是有人顺着纹路削的。削它的人手艺极高。"馆主大笑："那是馆里三代前的老馆主练手用的！眼毒。收了！"' },
    ],
  },
  ev_kaoyan_guishi: {
    id: 'ev_kaoyan_guishi', weight: 5, nodes: ['guishi'], kind: 'sect',
    text: '鬼市会长递给你一枚铜钱："行会收人，考一枚钱——这钱是我今天从市上收来的。你验验它。验完告诉我：它该卖多少？"',
    options: [
      { label: '上手细验，报出年代与真伪', cond: { minWuxing: 44, deny: '你验了半天，会长摇头："手是稳的，眼是生的。验物手不是一天练的——去市上蹲三个月，蹲到一眼识假再来。"' }, effect: { sect_join: 'guishi_hanghui', trait: { xin: 1 } }, text_after: '"前朝景和通宝，真品，但边上有道补——当年断过，有人锔过它。"会长笑了："报得全。还差一句：它该卖多少？——不急。入了行你会懂：这一句最难。跟我来。"' },
      { label: '"我没验就不知道价——但我知道它不是钱，是考题。"', effect: { sect_join: 'guishi_hanghui', trait: { cha: 1 } }, text_after: '会长愣了三息，大笑三声："好小子！鬼市每天有人拿假货当真货卖——能把真东西认出『不是它看起来的那个用处』的，十年没几个！收了！"' },
      { label: '"鬼市的规矩是漫天要价——越高越好。"', effect: { trait: { hen: 1 } }, text_after: '会长把铜钱收回袖中："高，不是价，是贪。鬼市无欺——四个字，二十年才养得出来。你这路数去别处能吃口饭，在我这儿，不行。"' },
    ],
  },
  ev_kaoyan_dengta: {
    id: 'ev_kaoyan_dengta', weight: 5, nodes: ['cl_dengtaya'], kind: 'sect',
    text: '守塔老司把灯罩递给你："灯塔司收人，就考一件事——塔上值夜，一夜不合眼。不考你的眼皮，考你『为什么不能睡』。你说说。"',
    options: [
      { label: '"灯灭一瞬，海上的船就没了方向——我睡的是别人的命。"', effect: { sect_join: 'dengta_si', trait: { ren: 1 } }, text_after: '老司点点头，眼眶有点红："三十年了，头一个这么答的。他们都说『我能熬』——熬是本事，可本事护不住命。知道自己护着什么的，才守得住。上塔，今夜你值上半夜。"' },
      { label: '"我能熬。我三天没睡都不困。"', effect: { trait: { ao: 1 } }, text_after: '老司摆摆手："能熬的多了。塔上不缺能熬的——缺知道『为什么不能睡』的。你这样的，去做船员好过做守塔人：船员熬坏了累自己，守塔的熬坏了，累死人。"他转身上塔，没再看你。' },
      { label: '"我熬不了一夜。但我可以先学怎么撑。"', effect: { sect_join: 'dengta_si', trait: { xin: 1 } }, text_after: '老司居然笑了："诚实。比吹牛的好——守夜功就是教你『怎么撑』的，三年入门，五年小成。你这样的，学得慢，走得远。收了。"' },
    ],
  },
  ev_kaoyan_chuanbang: {
    id: 'ev_kaoyan_chuanbang', weight: 5, nodes: ['nh_bujidao'], kind: 'sect',
    text: '帮主把一坛酒放在船头："船帮收人，先干这坛——不是我灌你。南海的规矩：上船前喝码头酒，是告诉海『我把命交给你了』。喝不喝？"',
    options: [
      { label: '捧坛畅饮，抹嘴："海收下了。"', effect: { sect_join: 'nanhai_chuanbang', trait: { hen: 1 } }, text_after: '帮主大笑："有种！酒见了底，海见了你——上船！记住，从今天起你的命不是你一个人的，是全船的；全船的命也不是他们自己的，是你的。这就叫『齐』。"' },
      { label: '"酒我喝。但我把命交给自己，不交给海。"', effect: { sect_join: 'nanhai_chuanbang', trait: { xin: 1 } }, text_after: '帮主盯着你看了半晌，忽然举坛："好！喝！海要的就是这种不交命的——交了命的，浪一来先慌。你把自己的命攥在手里，才攥得住别人的。上船！"' },
      { label: '"我不喝。神智不清的人上船，是全船的祸。"', effect: { sect_join: 'nanhai_chuanbang', trait: { cha: 1 } }, text_after: '帮主愣住，随即笑骂："有道理！帮规第三条就是『酒不上船』——我倒考倒我自己了！"他把酒收了，郑重递给你一顶斗笠："码头酒免了。帮里收你——帮规记得比帮主牢的人，缺不得。"' },
    ],
  },
  ev_kaoyan_yihui: {
    id: 'ev_kaoyan_yihui', weight: 5, nodes: ['qd_yihui'], kind: 'sect',
    text: '岛主领你到义会的粮仓前："义会收人，考一道难题——灾年粮少，仓里有两家的求助信：一家是三百人的渔村，一家是你同门的恩师。粮只够一家。你批给谁？"',
    options: [
      { label: '"批渔村。恩师的恩，我拿自己的口粮去还。"', effect: { sect_join: 'qundao_yihui', trait: { yi: 1 } }, text_after: '岛主点头，眼里有光："义会的账，从来是『公事公办，私情私还』。你分得清——比大多数会众分得清。收了。记住：拿自己口粮还恩的时候，别叫苦，那是你自己选的义。"' },
      { label: '"批恩师。人不能忘本。"', effect: { trait: { chi: 1 } }, text_after: '岛主沉默半晌："忘本不是坏事。可义会的粮是八岛人的口粮，不是你自己的——拿公家的粮还私恩，本就忘得更快。你这样的人恩义很重，但义会容不下『重到分不清公私』的恩义。去别处，做个快意恩仇的人吧。"' },
      { label: '"一家分一半——难看，但两边都活。"', effect: { sect_join: 'qundao_yihui', trait: { xin: 1 } }, text_after: '岛主想了很久："各半是下策——但你知道是下策，就不瞒着。义会要的就是这种『知道难看还敢下笔』的人。收了。批一半，另一半你去想办法——这才是会众的活法。"' },
    ],
  },
  ev_kaoyan_xunshan: {
    id: 'ev_kaoyan_xunshan', weight: 5, nodes: ['dh_yaoshi'], kind: 'sect',
    text: '卫长指着界碑边一串新鲜的兽迹："巡山卫收人，考这串足迹——一头独行的成年妖狼，昨夜过的界，往东去了。它是猎物吗？说说你的处置。"',
    options: [
      { label: '"先跟。看它往东做什么——兴许只是路过。"', effect: { sect_join: 'donghuang_xunshan', trait: { xin: 1 } }, text_after: '卫长点头："对。妖狼独行过界，十次里八次是路过，一次是找食，一次是……别的。跟，不惊，不猎——卫里教的头一课就是『妖也过日子』。收了。明天寅时，山线上工。"' },
      { label: '"妖入人界即是患——追上猎杀，一劳永逸。"', effect: { trait: { hen: 1 } }, text_after: '卫长脸色沉了："一劳永逸？去年你这么想的师兄追出去二十里，猎了那头狼——狼群三日后来「讲理」，伤了两个猎户。山上的账不是这么算的。你的刀太快，快得没长脑子。回去练三年心，刀放卫里。"' },
      { label: '"报哨。三长两短，让它自己退。"', effect: { sect_join: 'donghuang_xunshan', trait: { ren: 1 } }, text_after: '卫长眉毛一挑："还懂御妖哨？"他从怀里掏出一支旧哨："这是上一任哨长传下来的。他说过：哨是给讲道理的妖听的，也是给讲道理的人用的。你先说到『报哨』了——收了。哨，先借你使。"' },
    ],
  },
  ev_kaoyan_tuodui: {
    id: 'ev_kaoyan_tuodui', weight: 5, nodes: ['xm_xiangshi'], kind: 'sect',
    text: '队长把一只水囊递给你："驼队收人，就考这一囊水——前面还有六天沙路，水只够四天。现在给你两条路：匀着喝六天，人都半死；喝四天，最后两天赌井站有水。你选哪个？"',
    options: [
      { label: '"匀六天。人不该赌命——尤其不该拿全队的命赌。"', effect: { sect_join: 'ximo_tuodui', trait: { ren: 1 } }, text_after: '队长郑重把水囊塞给你："你答得像队长了。匀水虽然苦，但井站是『盼』不是『赌』——驼队四十年没赌过。收了。从今晚起，你分水。分水的人，自己最后喝。"' },
      { label: '"喝四天，赌井站。省下的力气多赶一倍路。"', effect: { trait: { hen: 1 } }, text_after: '队长摇头："驼队不赌。赌赢十次，第十一次连人带货埋在沙里——丝路上的白骨，一半是赌徒。你的胆子去做独行客正好，驼队养不起独行客。"' },
      { label: '"先量星盘改道——西南三站有旧井，绕两日，水就够六天。"', cond: { minWuxing: 46, deny: '队长听完，摇头又点头："法子对，可你连星盘都没摸过——这是书上的答案。大漠要的是脚上的答案。先跟队半年，学会了再答。"' }, effect: { sect_join: 'ximo_tuodui', trait: { cha: 1 } }, text_after: '队长盯着你看了很久，忽然笑了："绕井。四十年来第一个说出『改道』的——大漠的路是死的，人是活的。收了！从明天起，你跟我学星盘。学不会，就一辈子分水。"' },
    ],
  },
  ev_kaoyan_lieMeng: {
    id: 'ev_kaoyan_lieMeng', weight: 5, nodes: ['by_xueyuan'], kind: 'sect',
    text: '盟主领你到雪线边，指着雪地里一窝蜷着的雪兔："猎盟收人，考这一窝——母兔外出未归，六只幼崽。现在天冷，你的粮也快没了。你说说：挖不挖？"',
    options: [
      { label: '"不挖。母兽孕中不猎，幼崽也是——我挖的是明年的一窝。"', effect: { sect_join: 'beiyuan_lieMeng', trait: { ren: 1 } }, text_after: '盟主重重拍了拍你的肩："规矩记得牢。但光记规矩不够——你的粮呢？走，先回盟里吃饭。北原的规矩是活的：你今天饿肚子守了规矩，明天盟里管你饱。收了。"' },
      { label: '"挖。我快饿死了——先活下来，再谈规矩。"', effect: { trait: { chi: 1 } }, text_after: '盟主叹了口气："真到了那一步，挖了也不怪你——北原的雪不跟你讲道理。可你方才说的是『先活下来，再谈规矩』——规矩塌了就搭不回来。你走吧，去山下谋生。饿死之前，别把心里的东西卖了。"' },
      { label: '"不挖。我守到母兔回来——它回来，或许能分我一只大的。"', effect: { sect_join: 'beiyuan_lieMeng', trait: { xin: 1 } }, text_after: '盟主愣了愣，随即大笑："跟雪原讨价还价！有意思——雪原就吃这一套：你敬它一分，它让你一尺。"他解下自己的干粮袋扔给你："吃这个。守着你那窝兔子——盟里收你这种把日子过成『商量』的人。"' },
    ],
  },
  ev_kaoyan_kuanghang: {
    id: 'ev_kaoyan_kuanghang', weight: 5, nodes: ['kw_kuangshi'], kind: 'sect',
    text: '行老把耳朵贴在岩壁上听了三息，退开，示意你也听："矿工行收人，考这面壁——听三息，告诉我：这壁后的矿脉，还能挖多深？"',
    options: [
      { label: '贴耳细听，谨慎作答', cond: { minWuxing: 43, deny: '你听了半天，行老摇头："耳朵是好的，心太急——三息里你听了五息，杂音全进来了。矿工行的耳朵是练出来的，不是天生的。下矿三月，练完再来。"' }, effect: { sect_join: 'kunwu_kuanghang', trait: { xin: 1 } }, text_after: '你听了三息："再挖两丈。两丈后石声发空——是老采空区。"行老眼睛一亮："两丈零三尺，神了！收了！记住：矿下的『差不多』，就是『埋人』——你这耳朵，养得好，能救一井的人。"' },
      { label: '"我不知道。但我建议先支护再探——听不出来就别赌。"', effect: { sect_join: 'kunwu_kuanghang', trait: { cha: 1 } }, text_after: '行老愣了愣，抚掌："好！『听不出来』四个字，救过的人比好耳朵多——矿难十起，八起是『觉得自己听得出来』。收了！支护的规矩，从你这辈起，写进行规。"' },
      { label: '"听着差不多，能挖。"', effect: { trait: { hen: 1 } }, text_after: '行老的脸一下子沉了："差不多？矿下的『差不多』，去年埋了七个弟兄。你这耳朵去别处使吧——矿工行的耳朵，先得听得见人命。"' },
    ],
  },
  ev_kaoyan_shuyuanPai: {
    id: 'ev_kaoyan_shuyuanPai', weight: 5, nodes: ['lj_shuyuan'], kind: 'sect',
    text: '山长把你让进书房，案上摆着一份官府的文书："书院收人，收的不是读书种子，是『明理』的人。你看——县衙来函，请书院出面为一起冤案「作证面圣」。作证，书院得罪权贵；不作证，那户人家就冤沉了。你说，书院该不该去？"',
    options: [
      { label: '"去。书院的『理』字，就是留着这时候用的。"', effect: { sect_join: 'linjiang_shuyuanPai', trait: { yi: 1 } }, text_after: '山长点头，提笔就批了函件："你说得对——也不全对。书院去，不为『用理』，为『理本来就该在那儿』。批了。你明日随我进县衙——明理这条路，第一课就是看明白：理是有价钱的，有人得替它付。"' },
      { label: '"不去。书院是清议之地，不该卷入讼事。"', effect: { trait: { chi: 1 } }, text_after: '山长沉默良久："清议……清议若是用在该说话时不说话上，就只是『干净』罢了。书院的墙挡得住风雨，也挡得住良心。你是个稳妥的孩子——稳妥的人，去州府书院好些，那边不问这种题。"' },
      { label: '"先查清冤情的实据——理站不站得住，比去不去更要紧。"', effect: { sect_join: 'linjiang_shuyuanPai', trait: { xin: 1 } }, text_after: '山长眼中一亮："问在点子上了！书院去作证，作的是『实』——实据不查清，去了也是白去，还搭上一个书院。收了。明日你带两个学生，先把那案子的卷宗读三遍。"' },
    ],
  },
  ev_kaoyan_dujia: {
    id: 'ev_kaoyan_dujia', weight: 5, nodes: ['bc_shidu'], kind: 'sect',
    text: '老渡头把篙递给你，指向暮色里的河面："渡家收人，就考一篙——把船撑到对岸，再撑回来。天黑了，水凉了，客也走光了。你去撑一趟——不为考你，就问一句：没客的船，你撑不撑？"',
    options: [
      { label: '撑。夜里船要过一遍水，明天才稳当', effect: { sect_join: 'baicao_dujia', trait: { xin: 1 } }, text_after: '老渡头笑纹全开了："懂行！船跟人一样，天天不活动就锈——你连『没客的船也要活动』都懂，渡家的门就是给你开的。去吧，我在岸上看着——一篙一篙，慢慢来。"' },
      { label: '"没客撑什么船？白费力气。"', effect: { trait: { chi: 1 } }, text_after: '老渡头把篙收了回去："力气是白费，可你当船是做什么的？船是两岸人的桥——桥断了知道修，船歇久了就没法靠。你这算盘打得精，去镇上账房好过摆渡。水边不留算盘。"' },
      { label: '先问："对岸今晚有没有人等船？有就撑。"', effect: { sect_join: 'baicao_dujia', trait: { ren: 1 } }, text_after: '老渡头一愣："还真有——老周家的媳妇今晚临盆，她娘家在对岸！"他一把将篙塞回你手里："还愣着？撑！这一趟，就不是考你了——是渡家的活了。干这行的人，问的第一句就该是这个。"' },
    ],
  },
});
