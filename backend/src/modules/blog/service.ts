import { MedusaService } from "@medusajs/framework/utils"
import { Post, Comment } from "./models/blog"

class BlogModuleService extends MedusaService({
  Post,
  Comment,
}) {}

export default BlogModuleService
