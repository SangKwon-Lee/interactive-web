import "../style/home.css";
const list = [
  {
    type: "2D",
    pages: [
      {
        title: "Parallax scrolling",
        link: "/scroll",
      },
      {
        title: "Water Drop",
        link: "/dropwater",
      },
      {
        title: "Click Confetti",
        link: "/confetti",
      },
      {
        title: "Firework",
        link: "/firework",
      },
      {
        title: "Mouse Interactive",
        link: "/mouse-interactive",
      },
      {
        title: "Click Circle",
        link: "/circle",
      },
      {
        title: "Matter.js",
        link: "/matter",
      },
    ],
  },
];
export default function Home() {
  return (
    <div className="container">
      <header
        style={{
          fontSize: "36px",
          padding: "16px",
          borderBottom: "1px solid black",
        }}
      >
        <h1>Interactive Web Study</h1>
      </header>
      <main className="main">
        <ul className="list">
          {list.map((list, i) => (
            <li className="item" key={i}>
              <span className="type">{list.type}</span>
              <div className="pages">
                {Array.isArray(list.pages) &&
                  list.pages.length > 0 &&
                  list.pages.map((page, i) => (
                    <a className="link" key={i} href={page.link}>
                      {page.title}
                    </a>
                  ))}
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
