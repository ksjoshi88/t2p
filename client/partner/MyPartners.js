import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import List, { ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'
import { Link } from 'react-router-dom'
import { myPartners } from '../user/api-user.js'
import auth from '../auth/auth-helper'
import Snackbar from 'material-ui/Snackbar'
import ViewIcon from 'material-ui-icons/Visibility'

const styles = theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing.unit,
    margin: 0
  }),
  title: {
    margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  avatar: {
    marginRight: theme.spacing.unit * 1
  },
  follow: {
    right: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.protectedTitle
  },
  viewButton: {
    verticalAlign: 'middle'
  }
})
class MyPartners extends Component {
  state = {
    partners: [],
    open: false
  }
  componentDidMount = () => {
    const jwt = auth.isAuthenticated()
    myPartners({
      userId: jwt.user._id
    }, {
        t: jwt.token
      }).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          this.setState({ partners: data })
        }
      })
  }
  // clickRegister = (partner, index) => {
  //   const jwt = auth.isAuthenticated()
  //   registerPartner({
  //     userId: jwt.user._id
  //   }, {
  //     t: jwt.token
  //   }, partner._id).then((data) => {
  //     if (data.error) {
  //       this.setState({error: data.error})
  //     } else {
  //       let toRegister = this.state.partners
  //       toRegister.splice(index, 1)
  //       this.setState({partners: this.state.partners, open: true, registrationMessage: `Registered to ${partner.name}!`})
  //     }
  //   })
  // }
  handleRequestClose = (event, reason) => {
    this.setState({ open: false })
  }
  render() {
    const { classes } = this.props
    return (<div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          My Partners
        </Typography>
        <List>
          {this.state.partners.length == 0 && (
            <Typography variant="caption" align="center">
              Wow, such empty!
            </Typography>
          )}
          {this.state.partners.map((item, i) => {
            return <span key={i}>
              {/* {console.log(item.partner)} */}
              {/* {i != 0 && (<Divider/>)} */}
              <ListItem>
                <ListItemAvatar className={classes.avatar}>
                  <Avatar src={'/api/partners/photo/' + item.partner._id} />
                </ListItemAvatar>
                <Link to={"/partner/" + item.partner._id}>
                  <ListItemText primary={item.partner.name} />
                  {/* <IconButton variant="raised" color="secondary" className={classes.viewButton}>
                        <ViewIcon/>
                      </IconButton> */}
                </Link>
                {/* <ListItemSecondaryAction className={classes.follow}>
                    
                    <Button aria-label="Register" variant="raised" color="primary" onClick={this.clickRegister.bind(this, item, i)}>
                      Register
                    </Button>
                  </ListItemSecondaryAction> */}
                <ListItemSecondaryAction>
                  <ListItemText primary={item.points.toFixed(2) + " Points"} secondary={"Updated on: " + new Date(item.updated).getFullYear() + "-" + (new Date(item.updated).getMonth() + 1) + "-" + new Date(item.updated).getDate()} />
                </ListItemSecondaryAction>
              </ListItem>
              {/* <ListItem>
                  <ListItemText primary={item.points + " Points"} secondary={"Updated on: " + new Date(item.updated).getFullYear() + "-" + (new Date(item.updated).getMonth() + 1) + "-" + new Date(item.updated).getDate()}/>
                </ListItem> */}
            </span>
          })
          }
        </List>
      </Paper>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={this.state.open}
        onClose={this.handleRequestClose}
        autoHideDuration={6000}
        message={<span className={classes.snack}>{this.state.registrationMessage}</span>}
      />
    </div>)
  }
}

MyPartners.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(MyPartners)
