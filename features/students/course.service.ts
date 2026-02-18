import BaseService from "@/lib/api.service";

class CourseService extends BaseService {
  constructor() {
    super("courses");
  }

  async getCategories() {
    return await this.get("category");
  }

  async getCourses(categoryId?: string) {
    return await this.get("", { category_id: categoryId });
  }
}

const courseService = new CourseService();
export default courseService;
