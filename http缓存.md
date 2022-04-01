
# Http 缓存

## 强缓存


- 第一个字段是 Expires 

    因为 Expires 字段强依赖本地时间对比，所以经常会出现问题，缓存不更新。

    强缓存还存在无法更新资源的问题，当我们修改了服务器资源，但是没有到本地的 Expires 时，就会出现这个问题


- 使用第二个字段是  cache-control; max-age=1000

1000代表的秒 基于当次请求，超过1000秒之后，缓存过去

cache-control: no-store 代表的是 清空当前浏览器中的缓存

cache-control: no-cache 代表的事 不适用强缓存，使用协商缓存


- 使用协商缓存

cache-control:no-cache

no-cache 的意思是使用协商缓存，配合 last-modified 和 etag 进行协商缓存
no-store 的意思是不使用缓存

强缓存的优先级是高于协商缓存的

