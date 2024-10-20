import { MyProjectReactService } from './my-project-react-service.js';

describe('corporate service', () => {
  it('should say hello', async () => {
    const myProjectReactService = MyProjectReactService.from();
    const announcements = await myProjectReactService.listAnnouncements();
    expect(announcements.length).toEqual(2);
  })
});
