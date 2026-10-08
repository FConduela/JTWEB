import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260828071335 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "post" drop constraint if exists "post_slug_unique";`);
    this.addSql(`create table if not exists "post" ("id" text not null, "title" text not null, "slug" text not null, "content" text not null, "is_published" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "post_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_post_slug_unique" ON "post" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_post_deleted_at" ON "post" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "comment" ("id" text not null, "content" text not null, "is_approved" boolean not null default false, "customer_id" text null, "post_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "comment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_comment_post_id" ON "comment" ("post_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_comment_deleted_at" ON "comment" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "comment" add constraint "comment_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "comment" drop constraint if exists "comment_post_id_foreign";`);

    this.addSql(`drop table if exists "post" cascade;`);

    this.addSql(`drop table if exists "comment" cascade;`);
  }

}
