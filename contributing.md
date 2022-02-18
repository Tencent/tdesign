## gh-pages 分支部署方式及规范

1. 本部署分支会部署多个功能页面，所以要按功能或内容在根目录新建目录，名称要求浅显易懂。
2. 将功能分支打包好的内容放入新建目录即可，新建目录的根目录中必须要有 index.html 作为入口。
3. 部署后访问路径为 `https://Tencent.github.io/tdesign/${目录名称}`。
4. 可用脚本进行部署及文件操作，可参考 `issue-helper` 分支的 `scripts/deploy.sh` 文件。