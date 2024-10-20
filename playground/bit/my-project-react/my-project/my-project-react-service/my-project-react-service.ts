import { mockAnnouncements } from "@my-org/my-project.entities.announcement";

/**
 * corporate service
 */
export class MyProjectReactService {
  /**
   * say hello.
   */
  async listAnnouncements() {
    return mockAnnouncements();
  }

  /**
   * create a new instance of a corporate service.
   */
  static from() {
    return new MyProjectReactService();
  }
}    
