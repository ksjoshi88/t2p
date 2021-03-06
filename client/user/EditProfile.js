import React, {Component} from 'react'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import Avatar from 'material-ui/Avatar'
import FileUpload from 'material-ui-icons/FileUpload'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import auth from './../auth/auth-helper'
import {read, update} from './api-user.js'
import {Redirect} from 'react-router-dom'

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.protectedTitle
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
  },
  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  }
})

class EditProfile extends Component {
  constructor({match}) {
    super()
    this.state = {
      first_name: '',
      last_name: '',
      // about: '',
      photo: '',
      email: '',
      password: '',
      redirectToProfile: false,
      error: ''
    }
    this.match = match
  }

  componentDidMount = () => {
    this.userData = new FormData()
    const jwt = auth.isAuthenticated()
    read({
      userId: this.match.params.userId
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({id: data._id, first_name: data.first_name, last_name: data.last_name, email: data.email})
      }
    })
  }
  clickSubmit = () => {
    const jwt = auth.isAuthenticated()
    const user = {
      first_name: this.state.first_name || undefined,
      last_name: this.state.last_name || undefined,
      email: this.state.email || undefined,
      password: this.state.password || undefined,
      // about: this.state.about || undefined
    }
    update({
      userId: this.match.params.userId
    }, {
      t: jwt.token
    }, this.userData).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({'redirectToProfile': true})
      }
    })
  }
  handleChange = name => event => {
    const value = name === 'photo'
      ? event.target.files[0]
      : event.target.value
    this.userData.set(name, value)
    this.setState({ [name]: value })
  }

  handleKeyPress = () => event => {
    console.log(event)
    if (event.key == "Enter") {
      this.clickSubmit()
    }
  }

  render() {
    const {classes} = this.props
    const photoUrl = this.state.id
                 ? `/api/users/photo/${this.state.id}?${new Date().getTime()}`
                 : '/api/users/defaultphoto'
    if (this.state.redirectToProfile) {
      return (<Redirect to={'/user/' + this.state.id}/>)
    }
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            Edit Profile
          </Typography>
          <Avatar src={photoUrl} className={classes.bigAvatar}/><br/>
          <input accept="image/*" onChange={this.handleChange('photo')} className={classes.input} id="icon-button-file" type="file" />
          <label htmlFor="icon-button-file">
            <Button variant="raised" color="default" component="span">
              Upload
              <FileUpload/>
            </Button>
          </label> <span className={classes.filename}>{this.state.photo ? this.state.photo.name : ''}</span><br/>
          <TextField id="first_name" label="First Name" className={classes.textField} value={this.state.first_name} onChange={this.handleChange('first_name')} autoFocus margin="normal"/><br/>
          <TextField id="last_name" label="Last Name" className={classes.textField} value={this.state.last_name} onChange={this.handleChange('last_name')} margin="normal"/><br/>
          {/* <TextField
            id="multiline-flexible"
            label="About"
            multiline
            rows="2"
            value={this.state.about}
            onChange={this.handleChange('about')}
            className={classes.textField}
            margin="normal"
          /><br/> */}
          <TextField id="email" type="email" label="Email" className={classes.textField} value={this.state.email} onChange={this.handleChange('email')} margin="normal"/><br/>
          <TextField id="password" type="password" label="Password" className={classes.textField} value={this.state.password} onChange={this.handleChange('password')} onKeyPress={this.handleKeyPress()} margin="normal"/>
          <br/> {
            this.state.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {this.state.error}
            </Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
      </Card>
    )
  }
}

EditProfile.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(EditProfile)
