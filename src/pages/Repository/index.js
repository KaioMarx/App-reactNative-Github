import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

// import { Container } from './styles';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repo').name,
  });

  render() {
    const { navigation } = this.props;
    const repoHtml = navigation.getParam('repo').html_url;
    console.log(repoHtml)
    return (
      <WebView
        source={{ uri: repoHtml }}
        style={{ marginTop: 15 }}
      />
    );
  }
}
