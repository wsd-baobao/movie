

export default class Javxx implements Handle {
    getConfig() {
        return <Iconfig>{
            id: 'javxx',
            name: 'JAVXX',
            type: 1,
            nsfw: true,
            api: 'https://www.javxx.com'
        }
        
    };
    async getCategory() { 
        const tables = [
            {
                "id": "cn",
                "text": "首页"
            },
            {
                "id": "cn/hot",
                "text": "JWU3JTgzJWFkJWU5JTk3JWE4"
            },
            {
                "id": "cn",
                "text": "首页"
            },
           
            
        ]
        return tables.map(item => {
      const { id, text } = item
      if (id == "/") return item
      const a = atob(text)
      const b = decodeURIComponent(a)
      return { id, text: b }
    })
    };
    async getHome() { 
        const cate = env.get("category")
    const page = env.get("page")
    if (cate == "/") {
      const $ = kitty.load(await req(env.baseUrl))
      const titles = $(".category-count").toArray().map(item => {
        return $(item).text().replace("观看更多", "").trim()
      })
      const videos = $(".post-list").toArray().map(item => {
        return $(item).find("div.col-md-2").toArray().map(item => {
          const id = $(item).find("a").attr("href") ?? ""
          const cover = env.baseUrl + ($(item).find("img").attr("data-original") ?? "")
          const title = $(item).find(".entry-title").text().trim()
          const remark = $(item).find(".type-text").text().trim()
          return <IMovie>{ id, title, cover, remark }
        })
      })
      const list = titles.map((title, index) => {
        return <IHomeContentItem>{
          type: "list",
          title,
          videos: videos[index]
        }
      })
      return <IHomeData>{
        type: "complex",
        data: [
          ...list
        ]
      }
    }
    const url = `${env.baseUrl}/vodtype/${cate}-${page}/`
    const $ = kitty.load(await req(url))
    return $(".post-list .col-md-3").toArray().map<IMovie>(item => {
      const a = $(item).find("a")
      const img = a.find("img")
      const id = a.attr("href") ?? ""
      let cover = img.attr("data-original") ?? ""
      cover = `${env.baseUrl}${cover}`
      const title = img.attr("alt") ?? ""
      return { id, cover, title }
    })
    };
    async getDetail() {
    const id = env.get<string>("movieId")
    const url = `${env.baseUrl}${id}`
    const html = await req(url)
    const $ = kitty.load(html)
    const m3u8 = kitty.utils.getM3u8WithStr(html)
    const title = $(".breadcrumb").text().trim()
    return <IMovie>{
      id,
      title,
      playlist: [
        {
          title: "默认", videos: [
            { text: "😍播放", url: m3u8 }
          ]
        }
      ]
    }
  }
    // getSearch?: HandleSearch | undefined;
    // parseIframe?: HandleParseIframe | undefined; 


    
}