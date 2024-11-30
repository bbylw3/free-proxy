addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    const url = new URL(request.url)
    const targetUrl = new URL('http://free-proxy.cz/en/')
    
    // 添加重试机制
    const maxRetries = 3;
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        // 获取原始响应
        let response = await fetch(targetUrl.toString(), {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          cf: {
            // 启用 Cloudflare 缓存
            cacheTtl: 300,
            cacheEverything: true,
            // 添加超时设置
            timeout: 30
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 处理响应
        let html = await response.text();
        
        // 替换原始域名
        html = html.replace(/(https?:)?\/\/free-proxy\.cz/g, '');
        
        // 在处理 HTML 内容时添加过滤
        html = html
          // 移除顶部导航链接
          .replace(/<ul[^>]*>[\s\S]*?<\/ul>/g, '')
          // 移除社交媒体链接
          .replace(/<div[^>]*class="social"[^>]*>[\s\S]*?<\/div>/g, '')
          .replace(/<a[^>]*>(Twitter|Facebook|Google\+|Free Proxy List)[^<]*<\/a>/g, '')
          .replace(/<nav[^>]*>[\s\S]*?<\/nav>/g, '')
          .replace(/<div[^>]*>\s*<\/div>/g, '')
          // 移除底部多语言和版权信息，但保留分类链接
          .replace(/free-proxy\.cz © \d{4}/g, '')
          .replace(/<img[^>]*alt="(English|Česky|Français|Русский|中文|日本語)"[^>]*>.*?<\/a>/g, '')
          .replace(/♣/g, '')
          // 移除底部其他无用元素，但保留分类链接
          .replace(/<div[^>]*class="bottom"[^>]*>(?!.*?Proxies by category)[\s\S]*?<\/div>/g, '');
        
        // PornHub 风格的 UI
        html = html.replace('</head>', `
          <style>
            :root {
              --bg: #000000;
              --card-bg: #1b1b1b;
              --text: #ffffff;
              --text-secondary: #cccccc;
              --primary: #ff9000;
              --accent: #000000;
              --border: #2c2c2c;
            }

            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: -apple-system, system-ui, sans-serif;
            }

            body {
              background: var(--bg);
              color: var(--text);
              line-height: 1.6;
              padding: 20px;
            }

            .container {
              max-width: 1200px;
              margin: 0 auto;
            }

            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 20px;
              padding: 15px 20px;
              background: var(--card-bg);
              border-radius: 3px;
            }

            .logo-section {
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #ffffff;
            }

            .logo span {
              background: var(--primary);
              color: var(--accent);
              padding: 3px 8px;
              border-radius: 3px;
            }

            .subtitle {
              color: var(--text-secondary);
              font-size: 14px;
              margin-left: 15px;
              padding-left: 15px;
              border-left: 1px solid var(--border);
            }

            .proxy-card {
              background: var(--card-bg);
              border-radius: 3px;
              padding: 20px;
              margin-bottom: 20px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th {
              background: var(--bg);
              color: var(--primary);
              font-size: 13px;
              font-weight: 600;
              text-align: left;
              padding: 12px;
            }

            td {
              padding: 12px;
              font-size: 14px;
              border-bottom: 1px solid var(--border);
            }

            tr:hover td {
              background: #252525;
            }

            .footer {
              text-align: center;
              color: var(--text-secondary);
              font-size: 12px;
              padding: 20px 0;
            }

            .footer a {
              color: var(--primary);
              text-decoration: none;
            }

            @media (max-width: 768px) {
              body {
                padding: 10px;
              }
              
              .header {
                flex-direction: column;
                text-align: center;
                gap: 10px;
              }
              
              .subtitle {
                border: none;
                margin: 0;
                padding: 0;
              }
            }
          </style>
        </head>`);

        // 修改页面结构
        html = `
          <div class="container">
            <header class="header">
              <div class="logo-section">
                <div class="logo">Node<span>Hub</span></div>
                <div class="subtitle">免费代理服务器列表</div>
              </div>
              <div class="update-time">
                更新时间：${new Date().toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'})}
              </div>
            </header>

            <main class="proxy-card">
              ${html}
            </main>

            <footer class="footer">
              <p>Powered by NodeHub | <a href="http://free-proxy.cz/en/" target="_blank">free-proxy.cz</a></p>
            </footer>
          </div>
        `;

        return new Response(html, {
          headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'public, max-age=300',
            'Access-Control-Allow-Origin': '*'
          }
        });

      } catch (err) {
        lastError = err;
        // 如果不是最后一次重试，等待后继续
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }
      }
    }

    // 如果所有重试都失败了，返回错误响应
    return new Response(`请求失败，请稍后重试。错误信息：${lastError?.message || '未知错误'}`, {
      status: 502,
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err) {
    return new Response('服务器错误', { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain;charset=UTF-8'
      }
    });
  }
}