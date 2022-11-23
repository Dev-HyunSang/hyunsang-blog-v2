module.exports = {
  title: `hyunsang.dev`,
  description: `박현상의 프로그래밍 이야기`,
  language: `ko`, // `ko`, `en` => currently support versions for Korean and English
  siteUrl: `https://www.zoomkoding.com`,
  ogImage: `/og-image.png`, // Path to your in the 'static' folder
  comments: {
    utterances: {
      repo: `dev-hyunsang/dev-hyunsang.github.io`, // `zoomkoding/zoomkoding-gatsby-blog`,
    },
  },
  ga: '0', // Google Analytics Tracking ID
  author: {
    name: `박현상`,
    bio: {
      role: `개발자`,
      description: ['다양한 기술을 좋아하는', '철학을 사랑하는', '사진 찍는 것을 좋아하는'],
      thumbnail: 'sample.png', // Path to the image in the 'asset' folder
    },
    social: {
      github: `ttps://github.com/dev-hyunsang`, // `https://github.com/zoomKoding`,
      linkedIn: `https://www.linkedin.com/in/hyunsangpark/`, // `https://www.linkedin.com/in/jinhyeok-jeong-800871192`,
      email: `me@hyunsang.dev`, // `zoomkoding@gmail.com`,
    },
  },

  // metadata for About Page
  about: {
    timestamps: [
      // =====       [Timestamp Sample and Structure]      =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!) =====
      {
        date: '',
        activity: '',
        links: {
          github: '',
          post: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        date: '2020.12.17 ~ 12.19',
        activity: '제4회 정부혁신제안 끝장개발대회 인기상 수상',
        links: {
          post: '/gatsby-starter-zoomkoding-introduction',
          // github: 'https://github.com/zoomkoding/zoomkoding-gatsby-blog',
          // demo: 'https://www.zoomkoding.com',
        },
      },
      {
        date: '2020.09.12~13(예선)\n2020.10.17~18(본선)',
        activity: '국방부 사이버작전사령부 사이버 작전 경연대회 2020',
        links: {
          post: '/gatsby-starter-zoomkoding-introduction',
          // github: 'https://github.com/zoomkoding/zoomkoding-gatsby-blog',
          // demo: 'https://www.zoomkoding.com',
        },
      },
      {
        date: '2021.08.09 ~',
        activity: 'Software Engineer @TeamGRIT, Inc.',
        links: {
          post: '/gatsby-starter-zoomkoding-introduction',
          // github: 'https://github.com/zoomkoding/zoomkoding-gatsby-blog',
          // demo: 'https://www.zoomkoding.com',
        },
      },
    ],

    projects: [
      // =====        [Project Sample and Structure]        =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!)  =====
      {
        title: '',
        description: '',
        techStack: ['', ''],
        thumbnailUrl: '',
        links: {
          post: '',
          github: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        title: 'Software Engineer @TeamGRIT, Inc.',
        description:
          '팀그릿에서 미디어와 관련된 솔루션을 개발하였습니다.',
        techStack: ['Golang', 'Rust'],
        // thumbnailUrl: 'blog.png',
        links: {
          post: '/gatsby-starter-zoomkoding-introduction',
          // github: 'https://github.com/zoomkoding/zoomkoding-gatsby-blog',
          // demo: 'https://www.zoomkoding.com',
        },
      },
    ],
  },
};
