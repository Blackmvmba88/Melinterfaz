import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
const root=resolve(fileURLToPath(new URL(".",import.meta.url)),"web");
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8"};
const port=Number(process.env.PORT||8000);
createServer(async(req,res)=>{
  try{
    const pathname=new URL(req.url,"http://localhost").pathname;
    const name=decodeURIComponent(pathname);
    const target=resolve(root,"."+ (name==="/" ? "/index.html":name));
    if(target!==root&&!target.startsWith(root+sep)){res.writeHead(403);res.end("Forbidden");return}
    const body=await readFile(target);
    res.writeHead(200,{"Content-Type":types[extname(target)]||"application/octet-stream","X-Content-Type-Options":"nosniff"});
    res.end(body);
  }catch{res.writeHead(404);res.end("Not found")}
}).listen(port,"127.0.0.1",()=>console.log(`MEL Explorer: http://127.0.0.1:${port}`));
