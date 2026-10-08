import { model } from "@medusajs/framework/utils"

export const Post = model.define("post", {
  id: model.id().primaryKey(),
  title: model.text(),
  slug: model.text().unique(),
  content: model.text(),
  image_url: model.text().nullable(),
  is_published: model.boolean().default(false),
  comments: model.hasMany(() => Comment, { mappedBy: "post" }),
})

export const Comment = model.define("comment", {
  id: model.id().primaryKey(),
  content: model.text(),
  is_approved: model.boolean().default(false),
  customer_id: model.text().nullable(),
  post: model.belongsTo(() => Post, { mappedBy: "comments" }),
})
