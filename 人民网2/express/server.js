const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// 模拟新闻数据
const newsData = {
  // 轮播图数据
  banners: [
    {
      id: 1,
      title: "习近平主持召开新时代推动东北全面振兴座谈会",
      subtitle: "牢牢把握东北的重要使命 奋力谱写东北全面振兴新篇章",
      category: "时政要闻",
      image: "http://www.people.com.cn/NMediaFile/2025/0610/MAIN17495388999521HALUEZW7N.jpg",
      url: "https://www.people.com.cn/",
      time: "2024-06-09 15:30"
    },
    {
      id: 2,
      title: "李强主持召开国务院常务会议",
      subtitle: "研究促进民营经济发展壮大的政策举措",
      category: "国务院",
      image: "http://www.people.com.cn/NMediaFile/2025/0610/MAIN17495226157198CF8LEUJ22.jpg",
      url: "https://www.people.com.cn/",
      time: "2024-06-09 14:15"
    },
    {
      id: 3,
      title: "全国政协十四届常委会第七次会议举行",
      subtitle: "围绕推动数字经济高质量发展进行专题议政",
      category: "全国政协",
      image: "http://www.people.com.cn/NMediaFile/2025/0610/MAIN17495388999521HALUEZW7N.jpg",
      url: "https://www.people.com.cn/",
      time: "2024-06-09 13:20"
    },
    {
      id: 4,
      title: "中办国办印发《关于新时代推进美丽中国建设的意见》",
      subtitle: "到2035年广泛形成绿色生产生活方式",
      category: "环境保护",
      image: "http://www.people.com.cn/NMediaFile/2025/0610/MAIN1749542952341O9ZFREBTB5.jpg",
      url: "https://www.people.com.cn/",
      time: "2024-06-09 12:45"
    },
    {
      id: 5,
      title: "我国网络文明建设取得新进展新成效",
      subtitle: "网络空间更加清朗 网络文明理念深入人心",
      category: "网络文明",
      image: "http://www.people.com.cn/NMediaFile/2025/0610/MAIN1749522000809CG3K6WU4NE.jpg",
      url: "https://www.people.com.cn/",
      time: "2024-06-09 11:30"
    }
  ],

  // 主要新闻列表
  mainNews: [
    {
      id: 1,
      title: "习近平在新时代推动东北全面振兴座谈会上强调 牢牢把握东北的重要使命 奋力谱写东北全面振兴新篇章",
      category: "时政",
      time: "2024-06-09 15:30",
      url: "https://www.people.com.cn/",
      isHot: true,
      views: 12580,
      summary: "要牢牢把握东北在维护国家五大安全中的重要使命，全面贯彻党的二十大精神"
    },
    {
      id: 2,
      title: "李强主持召开国务院常务会议 研究促进民营经济发展壮大的政策举措等",
      category: "时政",
      time: "2024-06-09 14:15",
      url: "https://www.people.com.cn/",
      isHot: true,
      views: 9876,
      summary: "审议通过《关于促进民营经济发展壮大的意见》"
    },
    {
      id: 3,
      title: "全国政协十四届常委会第七次会议举行全体会议 王沪宁出席",
      category: "时政",
      time: "2024-06-09 13:20",
      url: "https://www.people.com.cn/",
      isHot: false,
      views: 7654,
      summary: "围绕'推动数字经济高质量发展'进行专题议政"
    },
    {
      id: 4,
      title: "中办国办印发《关于新时代推进美丽中国建设的意见》",
      category: "社会",
      time: "2024-06-09 12:45",
      url: "https://www.people.com.cn/",
      isHot: true,
      views: 8901,
      summary: "到2035年广泛形成绿色生产生活方式，碳排放达峰后稳中有降"
    },
    {
      id: 5,
      title: "我国网络文明建设取得新进展新成效",
      category: "科技",
      time: "2024-06-09 11:30",
      url: "https://www.people.com.cn/",
      isHot: false,
      views: 6543,
      summary: "网络空间更加清朗，网络文明理念更加深入人心"
    },
    {
      id: 6,
      title: "前五个月我国服务贸易延续增长态势",
      category: "经济",
      time: "2024-06-09 10:45",
      url: "https://www.people.com.cn/",
      isHot: false,
      views: 5432,
      summary: "服务进出口总额28530.9亿元，同比增长14.2%"
    },
    {
      id: 7,
      title: "国家发展改革委：持续优化民间投资环境",
      category: "经济",
      time: "2024-06-09 09:30",
      url: "https://www.people.com.cn/",
      isHot: false,
      views: 4321,
      summary: "进一步激发民间投资活力，促进经济持续健康发展"
    },
    {
      id: 8,
      title: "教育部：全面推进大中小学思政课一体化建设",
      category: "教育",
      time: "2024-06-09 08:15",
      url: "https://www.people.com.cn/",
      isHot: false,
      views: 3210,
      summary: "构建完善的思政课课程体系和教学体系"
    }
  ],

  // 侧边栏新闻
  sideNews: [
    {
      id: 1,
      title: "行进中国｜调研采访团队走进吉林长春",
      category: "专题",
      time: "2024-06-09 16:00",
      url: "https://www.people.com.cn/",
      image: "https://via.placeholder.com/120x80/ff7675/ffffff?text=长春调研"
    },
    {
      id: 2,
      title: "从8组数据看前五月我国外贸运行亮点",
      category: "经济",
      time: "2024-06-09 15:30",
      url: "https://www.people.com.cn/",
      image: "https://via.placeholder.com/120x80/74b9ff/ffffff?text=外贸数据"
    },
    {
      id: 3,
      title: "中国网络文明大会网络文明培育分论坛举办",
      category: "社会",
      time: "2024-06-09 14:45",
      url: "https://www.people.com.cn/",
      image: "https://via.placeholder.com/120x80/55efc4/ffffff?text=网络文明"
    },
    {
      id: 4,
      title: "文化和旅游部推出10条长征主题旅游线路",
      category: "文化",
      time: "2024-06-09 13:30",
      url: "https://www.people.com.cn/",
      image: "https://via.placeholder.com/120x80/fd79a8/ffffff?text=长征旅游"
    },
    {
      id: 5,
      title: "全国生态日主题宣传活动在各地举行",
      category: "环保",
      time: "2024-06-09 12:15",
      url: "https://www.people.com.cn/",
      image: "https://via.placeholder.com/120x80/00b894/ffffff?text=生态保护"
    }
  ],

  // 热点话题
  hotTopics: [
    { id: 1, title: "学习贯彻习近平新时代中国特色社会主义思想", url: "https://www.people.com.cn/" },
    { id: 2, title: "2025全国两会", url: "https://www.people.com.cn/" },
    { id: 3, title: "高质量发展", url: "https://www.people.com.cn/" },
    { id: 4, title: "乡村振兴", url: "https://www.people.com.cn/" },
    { id: 5, title: "生态文明建设", url: "https://www.people.com.cn/" },
    { id: 6, title: "数字经济", url: "https://www.people.com.cn/" },
    { id: 7, title: "民营经济发展", url: "https://www.people.com.cn/" },
    { id: 8, title: "网络文明", url: "https://www.people.com.cn/" }
  ]
};

// API接口
app.get('/api/banners', (req, res) => {
  setTimeout(() => {
    res.json({
      success: true,
      data: newsData.banners,
      message: '轮播图获取成功'
    });
  }, 500);
});

app.get('/api/news/main', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  setTimeout(() => {
    res.json({
      success: true,
      data: newsData.mainNews.slice(startIndex, endIndex),
      pagination: {
        current: page,
        total: Math.ceil(newsData.mainNews.length / limit),
        hasNext: endIndex < newsData.mainNews.length
      },
      message: '主要新闻获取成功'
    });
  }, 300);
});

app.get('/api/news/side', (req, res) => {
  setTimeout(() => {
    res.json({
      success: true,
      data: newsData.sideNews,
      message: '侧边栏新闻获取成功'
    });
  }, 200);
});

app.get('/api/topics/hot', (req, res) => {
  setTimeout(() => {
    res.json({
      success: true,
      data: newsData.hotTopics,
      message: '热点话题获取成功'
    });
  }, 100);
});

app.get('/api/news', (req, res) => {
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        banners: newsData.banners,
        mainNews: newsData.mainNews,
        sideNews: newsData.sideNews,
        hotTopics: newsData.hotTopics
      },
      message: '所有数据获取成功'
    });
  }, 800);
});



// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

app.listen(port, () => {
  console.log(`🚀 人民网服务器运行在 http://localhost:${port}`);
  console.log('📊 可用API接口:');
  console.log(`   GET http://localhost:${port}/api/news - 获取所有数据`);
  console.log(`   GET http://localhost:${port}/api/banners - 获取轮播图`);
  console.log(`   GET http://localhost:${port}/api/news/main - 获取主要新闻`);
  console.log(`   GET http://localhost:${port}/api/news/side - 获取侧边栏新闻`);
  console.log(`   GET http://localhost:${port}/api/topics/hot - 获取热点话题`);
});