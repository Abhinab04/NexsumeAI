import helmet from "helmet";

const helmetConfig = helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      imgSrc: ["'self'", "data:", "https://img.icons8.com/"],
    },
  },
});

export default helmetConfig;
