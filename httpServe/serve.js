const http = require("http");
const process = require("process");
const etag = require("etag");
const fs = require("fs");
const { readFile } = fs;
const server = http.createServer((req, res) => {
  const relationPath = process.cwd();
  if (req.url === "/1.png") {
    let imagePath = relationPath + "/httpServe/1.png";
    readFile(imagePath, (err, imageData) => {
      if (err) throw err;

      // 第一种情况 设置过期时间 存在两个问题
      // res.setHeader("Expires", new Date("2022-04-02 22:12:06").toUTCString());

      // 第二种情况 设置相对时间 max-age
      // 这个相对合理，但是有时候还是会对资源请求有浪费 没办法做到100%根据改变后 再返回 不改变不返回
      // max-age 越大越容易造成资源未更新
      // res.setHeader("Cache-Control", "max-age=10");

      // 第三种情况协商缓存
      // 只能根据资源的时间戳，有时候内容根本没有边 只是切换了名字
      // 因为时间最基本的单位是秒 有时候 修改太快 就会造成没有更新缓存的问题
      // fs.stat(imagePath, (err, data) => {
      //   console.log(imagePath, err);

      //   let ifModifiedSince = req.headers["if-modified-since"];
      //   let imageLastModifyTime = data.mtime.toUTCString();
      //   if (ifModifiedSince === imageLastModifyTime) {
      //     res.statusCode = 304;
      //     res.end();
      //     return;
      //   }

      //   res.setHeader("Cache-Control", "no-cache;");
      //   res.setHeader("Last-Modified", imageLastModifyTime);
      //   res.end(imageData);
      // });

      // 第四种情况协商缓存 E-tag
      fs.stat(imagePath, (err, data) => {
        const contentEtag = etag(data);

        let ifNoneMatch = req.headers["if-none-match"];

        console.log("contentEtag", contentEtag, ifNoneMatch);

        if (contentEtag === ifNoneMatch) {
          res.statusCode = 304;
          res.end();
          return;
        }

        res.setHeader("Cache-Control", "no-cache;");
        res.setHeader("etag", contentEtag);
        res.end(imageData);
      });
    });
    return;
  }

  readFile(relationPath + "/httpServe/html/index.html", (err, data) => {
    if (err) throw err;
    res.end(data);
  });
});

server.listen(8000, () => {
  console.log("服务已经启动");
});
