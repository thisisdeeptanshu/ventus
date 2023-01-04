function TitleBar() {
  return (
    <div>
      <div className="title-div larger">
        <h1 className="title-smaller"><a className="imnothere" href="/lepersonne">Le Personne</a></h1>
        <h1 className="title-smaller"><a className="imnothere" href="/lespersonnes">Les Personnes</a></h1>
        <h1 className="title-smaller"><a className="imnothere" href="/leursmots">Leurs Mots</a></h1>
      </div>
      <div className="title-div smaller">
        <h1 className="title-smaller" style={{borderRight: "1px solid black", paddingRight: "10px"}}><a className="imnothere" href="/lepersonne">Me</a></h1>
        <h1 className="title-smaller" style={{padding: "0 10px"}}><a className="imnothere" href="/lespersonnes">Them</a></h1>
        <h1 className="title-smaller" style={{borderLeft: "1px solid black", paddingLeft: "10px"}}><a className="imnothere" href="/leursmots">Us</a></h1>
      </div>
    </div>
  );
}

export default TitleBar;