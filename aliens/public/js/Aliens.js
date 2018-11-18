


class Aliens extends React.Component {
  constructor (props){
    super(props)

    //set up states
    this.state = {
      aliensListIsVisible: false,
      addAlienIsVisible: false,
      alienIsVisible: false,
      editAlienIsVisible: false,
      aliens: [],
      alien: {},
      isHidden: true
    }

    // binds
    this.deleteAlien = this.deleteAlien.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this)
    this.getAlien = this.getAlien.bind(this)
    this.toggleState = this.toggleState.bind(this)
    this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this)


  }

  componentDidMount () {
    this.getAliens()
  }

  deleteAlien (alien, index) {
    fetch('/aliens/' + alien.id,
    {
      method: 'DELETE'
    })
    .then(data => {
      this.setState({
        aliens: [
          ...this.state.aliens.slice(0, index),
          ...this.state.aliens.slice(index + 1)
        ]
      })
    })
  }

  handleCreate (alien) {
      const updatedAliens = this.state.aliens
      updatedAliens.unshift(alien)
      this.setState({aliens: updatedAliens})
  }

  handleCreateSubmit (alien) {
    fetch('/aliens/', {
      body: JSON.stringify(alien),
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(createdAlien => {
        return createdAlien.json()
      })
      .then(jsonedAlien => {
        this.handleCreate(jsonedAlien)
        this.toggleState('addAlienIsVisible', 'alienListIsVisible')
      })
      .catch(error => console.log(error))
}


  getAlien(alien) {
    this.setState({alien: alien})
  }

  getAliens () {
    fetch('/aliens')
      .then((response) => {
        response.json().then((data) => {
          this.setState({
            aliens: data
          })

        })
      })
      .catch(error => console.log(error))
  }


  toggleState (st1, st2) {
    this.setState({
      [st1]: !this.state[st1],
      [st2]: !this.state[st2]
    })
  }

  handleUpdateSubmit (alien) {
    fetch('/aliens/'+ alien.id, {
      body: JSON.stringify(alien),
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(updatedAlien => {
        return updatedAlien.json()
      })
      .then(jsonedAlien => {
        this.getAliens()
        this.toggleState('aliensListIsVisible', 'alienIsVisible')
      })
      .catch(error => console.log(error))
  }






  render () {
  return (
    <div className='aliens'>


      {this.state.isHidden ?
        <div>

        <img src='https://pbs.twimg.com/media/CrCKqU6XgAAPbuS.jpg' />
        <button onClick={()=> this.toggleState('aliensListIsVisible', 'isHidden')}>Take A number</button>
        </div>
        :
        ''
       }


      <h2>Aliens</h2>
      <button className='button is-success' onClick={()=> this.toggleState('addAlienIsVisible')}>Add an Alien</button>

      {this.state.aliensListIsVisible ?


        <AliensList
        toggleState={this.toggleState}
        aliens={this.state.aliens}

        getAlien={this.getAlien}
        deleteAlien={this.deleteAlien}
        />

        : '' }


      {this.state.addAlienIsVisible ?
        <AlienForm
        toggleState={this.toggleState}
        handleCreate={this.handleCreate}
        handleSubmit={this.handleCreateSubmit}
        />
         : '' }
      {this.state.alienIsVisible ?
        <Alien
        toggleState={this.toggleState}
        alien = {this.state.alien}
        handleSubmit={this.handleUpdateSubmit}
        />
        : ''}
    </div>


  )
}

}
