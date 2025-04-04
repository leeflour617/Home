// server.ts
import { serveDir } from "https://deno.land/std@0.208.0/http/file_server.ts"; // 确保使用合适的 std 版本

Deno.serve((req: Request) => {
  // 尝试从 'dist' 目录提供静态文件
  return serveDir(req, {
    fsRoot: "./dist",       // 指定静态文件的根目录是 ./dist
    urlRoot: "",            // 网站根路径
    index: "index.html",    // 访问目录时默认提供的文件
    enableCors: true,       // 可选：如果需要跨域访问资源
    quiet: true             // 可选：不在控制台输出每次文件服务的日志
  });
});

console.log("Static file server listening on http://localhost:8000"); // 本地测试用
