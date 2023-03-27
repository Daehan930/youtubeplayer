import './App.scss';

function App() {
  return (
    <header>
      <div className="glass">
        <div className="menu">
          <div className="logo">world.</div>
          <nav>
            <ul className="navigation">
              <li><a href="#">home</a></li>
              <li><a href="#">destinations</a></li>
              <li><a href="#">contact</a></li>
            </ul>
          </nav>
        </div>
        <div className="header-text">
          <h1>Explore the beautiful <br/>beaches</h1>
          <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Nulla non lectus sed nisl molestie malesuada. </p>
        </div>
        <div className="header-grid">
          <img src="https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80" alt="" />
          <img src="https://images.unsplash.com/photo-1468413253725-0d5181091126?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="" />
          <img src="https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1052&q=80" alt="" />
        </div>

        {/* 
        기존 부모위 올라오는 모달창으로 참고
        <div className="box box__1"></div>
        <div className="box box__2"></div> 
        */}
        
      </div>
    </header>
  );
}

export default App;
