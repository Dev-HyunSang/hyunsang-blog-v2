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
      thumbnail: 'simple.png', // Path to the image in the 'asset' folder
    },
    social: {
      github: `https://github.com/dev-hyunsang`, // `https://github.com/zoomKoding`,
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
        date: '2017.03 ~ 2021.11',
        activity: `목포대학교 정보보호영재교육원\n
        중등기초, 중듬심화, 고등전문 수료`
      },
      {
        date: '2020.09.12~13(예선)\n2020.10.17~18(본선)',
        activity: '국방부 사이버작전사령부 사이버 작전 경연대회 2020',
      },
      {
        date: '2020.12.17 ~ 12.19',
        activity: '제4회 정부혁신제안 끝장개발대회 인기상 수상',
      },
      {
        date: '2021.08.09 ~',
        activity: 'Software Engineer @TeamGRIT, Inc.',
      },
      {
        date: '2022.03.31',
        activity: 'GDG Golang Korea Golang 1.18 Release Party 발표',
      },
      {
        date: '2023.03 ~ ',
        activity: '순천향대학교 정보보호학과 재학',
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
          '팀그릿에서 미디어와 관련된 솔루션을 개발하고 있습니다.\n주로 Go언어를 통해서 미디어 스토리지를 개발하고 있습니다.',
        techStack: ['Golang', 'Rust'],
      },
      {
        title: 'GDG Golang Korea Golang 1.18 Release Party 발표',
        description:
        '팀그릿에서 진행하였던 프로젝트에 대해서 “Go와 FFmpeg를 이용한 영상 처리 그리고 AWS S3 활용하기”라는 주제로 발표를 하였습니다. 팀그릿에서 개발했던 내용들을 바탕으로 발표하였습니다.',
        techStack: ['Golang', 'Presentation'],
      },
    ],
  },
};
