import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Button } from 'reactstrap';

const Botonera = (props) => {
  // Este es el componente que muestra la tabla.
  let lista = [];
  for(let i = 0; i < props.matriz.length; i++){
    for(let j = 0; j < props.matriz[i].length; j++){
      let aux = props.getColor(props.matriz[i][j]);
      let b;
      //Ponemos el color deseado, teniendo en cuenta los cambios al clickar
      if(typeof aux === "undefined"){
        b = <Button outline>{props.matriz[i][j]}</Button>
      }else{
        b = <Button onClick={() => props.click(i, j)} color={aux} >{props.matriz[i][j]}</Button>
      }
      lista.push(b);
    }
    lista.push(<br/>);
  }
  return lista;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      biocenosis: [
        ['P', 'P', 'G', 'H', 'H', 'R'],
        ['P', 'P', 'G', 'H', 'H', 'G', 'H'],
        ['P', 'G', 'M', 'H', 'H', 'G', 'H', 'H'],
        ['G', 'R', 'M', 'H', 'G', 'G'],
        ['R', 'R', 'H', 'H', 'G', 'P']
      ],

      colores: [
        { animal: "P", color: "primary" }, 
        { animal: "G", color: "info" }, 
        { animal: "R", color: "success"}, 
        { animal: "m", color: "danger" }, 
        { animal: "M", color: "warning"}, 
        { animal: "H", color: "secondary" },
      ],
      humans: 0,
    };
  }

  componentWillMount(){
    this.calcularHumanos();
  }

  calcularHumanos(){
    let h = 0;
    //Recorremos biocenosis por filas y filtramos por H cada una quedándonos con el número de elemento en cada uno
    this.state.biocenosis.map(aux => h += aux.filter(e => e == 'H').length);
    this.setState({humans: h});
  }

  cambioLetra(x){
    let cambio = 'm';
    if(x == 'H'){
      cambio = '-';
    }
    return cambio;
  }

  getColor(x){
    let aux = this.state.colores.find(e => e.animal == x);
    let b = undefined;
    if(typeof aux !== "undefined"){
      b = aux.color;
    }
    return b;
  }

  //Expandimos el virus entre Humanos y Murciélagos
  comprobarContiguos(i, j, m){
    //i-1
    if(i > 0 && (m[i-1][j] == 'H' || m[i-1][j] == 'M')){
      m[i-1][j] = this.cambioLetra(m[i-1][j]);
      this.comprobarContiguos(i-1, j, m);
    }
    //i+1
    if(i < m.length-1 && (m[i+1][j] == 'H' || m[i+1][j] == 'M')){
      m[i+1][j] = this.cambioLetra(m[i+1][j]);
      this.comprobarContiguos(i+1, j, m);
    }
    //j-1
    if(j > 0 && (m[i][j-1] == 'H' || m[i][j-1] == 'M')){
      m[i][j-1] = this.cambioLetra(m[i][j-1]);
      this.comprobarContiguos(i, j-1, m);
    }
    //j+1
    if(j < m[i].length-1 && (m[i][j+1] == 'H' || m[i][j+1] == 'M')){
      m[i][j+1] = this.cambioLetra(m[i][j+1]);
      this.comprobarContiguos(i, j+1, m);
    }
  }

  propagar(i, j){
    let m = this.state.biocenosis;
    if(m[i][j] == 'M'){
      m[i][j] = 'm';
      this.comprobarContiguos(i, j, m);
    }else if(m[i][j] == 'H'){
      m[i][j] = '-';
      this.comprobarContiguos(i, j, m);
    }
    this.setState({biocenosis: m});
    this.calcularHumanos();
  }

  // Muestra los humanos vivos
  // Muestra Botonera que es el tablero
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>ANGRYBATS</h1>
          <p>Humanos restantes: {this.state.humans}</p>
          <Botonera matriz = {this.state.biocenosis} colores = {this.state.colores} getColor={(x) => this.getColor(x)} click = {(f,c) => this.propagar(f,c)}/>
        </header>
      </div>
    );
  }
}
export default App;
