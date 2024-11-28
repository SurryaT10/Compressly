import '../css/navbar.css'

function Navbar({ onAboutClick }) {
    return (
      <div className="navbar">
        <h2>Compressly</h2>
        <h4 style={{cursor: "pointer"}} onClick={onAboutClick}>About</h4>
      </div>
    );
  }
  
  export default Navbar;