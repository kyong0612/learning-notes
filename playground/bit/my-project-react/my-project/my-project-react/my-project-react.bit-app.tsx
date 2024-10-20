import { Platform } from '@bitdev/platforms.platform';

const MyProjectReactWeb = import.meta.resolve('@my-org/my-project.my-project-react-web');
const MyProjectReactService = import.meta.resolve('@my-org/my-project.my-project-react-service');

export const MyProjectReact = Platform.from({
  name: 'my-project-react',

  frontends: {
    main: MyProjectReactWeb,
    mainPortRange: [3000, 3100]
  },

  backends: {
    main: MyProjectReactService,
  },
});

export default MyProjectReact;
