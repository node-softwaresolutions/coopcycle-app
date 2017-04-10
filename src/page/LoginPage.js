import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
} from 'react-native';
import {
  Container, Header, Title, Content,
  List, ListItem,
  InputGroup, Input,
  Left, Right, Body,
  Icon, Text, Picker, Button
} from 'native-base';

const Settings = require('../Settings');

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: undefined,
      password: undefined,
      message: undefined,
    };
  }
  _onSubmit(navigator) {
    this.props.client.login(this.state.email, this.state.password)
      .then((user) => {
        navigator.parentNavigator.pop();
        this.props.onLoginSuccess(user);
      })
      .catch((err) => {
        if (err.hasOwnProperty('code') && err.code === 401) {
          this.setState({message: "Utilisateur et/ou mot de passe inexistant."});
        } else {
          this.setState({message: "Veuillez réessayer plus tard"});
        }
      });
  }
  disconnect(navigator) {
    navigator.parentNavigator.pop();
    Settings.removeServer();
  }
  render() {
    return (
      <Navigator
        renderScene={this.renderScene.bind(this)}
        navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => navigator.parentNavigator.pop()}>
              <Icon name='close' />
            </Button>
          </Left>
          <Body>
            <Title>Restaurants</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{ paddingTop: 40 }}>
          <List>
            <ListItem>
              <InputGroup>
                <Icon name="ios-person" style={{ color: '#0A69FE' }} />
                <Input ref="email"
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(email) => this.setState({ email })}
                  style={{height: 40}}
                  placeholder="Nom d'utilisateur" />
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Icon name="ios-unlock" style={{ color: '#0A69FE' }} />
                <Input ref="password"
                  autoCorrect={false}
                  autoCapitalize="none"
                  secureTextEntry={true}
                  onChangeText={(password) => this.setState({ password })}
                  style={{height: 40}}
                  placeholder="Mot de passe" />
              </InputGroup>
            </ListItem>
          </List>
          <Button style={{ alignSelf: 'center', marginTop: 20, marginBottom: 20 }} onPress={this._onSubmit.bind(this, navigator)}>
            <Text>Valider</Text>
          </Button>
          <View style={{ marginTop: 30 }}>
            <Text style={{ textAlign: 'center' }}>Connecté à <Text style={{ fontWeight: 'bold' }}>{ this.props.server }</Text></Text>
            <Button block transparent onPress={ this.disconnect.bind(this, navigator) }>
              <Text>Choisir un autre serveur</Text>
            </Button>
          </View>
          <View style={styles.message}>
            <Text>{this.state.message}</Text>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  message: {
    alignItems: "center",
    padding: 20,
  }
});

module.exports = LoginPage;