import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import { ActivityIndicator } from 'react-native';

import { Header, Container, Avatar, Name, Bio, Stars, Starred, OwnerAvatar, Info, Title, Author, WebButton, WebButtonText } from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    refreshing: false,
    loading: true,
    page: 1,
  };

  async componentDidMount() {
    this.load()
  }

  load = async (page = 1) => {
    const { stars } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const { data } = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });

    this.setState({
      stars: page >= 2 ? [...stars, ...data] : data,
      page,
      loading: false,
      refreshing: false,
    });
  };

  loadMore = () => {
    const { page } = this.state;

    const nextPage = page + 1;

    this.load(nextPage);
  };

  refreshList = () => {
    this.setState({ refreshing: true, stars: [] }, this.load)
  }

  handleNavigation = (repo) => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repo })
  }

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing, Pressed } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ActivityIndicator color="#7159c1" size="large" />
        ) : (
            <Stars
              data={stars}
              keyExtractor={star => String(star.id)}
              onEndReached={this.loadMore}
              onEndReachedThreshold={0.2}
              onRefresh={this.refreshList}
              refreshing={refreshing}
              renderItem={({ item }) => (
                <Starred>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title
                      onPress={() => this.handleNavigation(item)}
                    >
                      {item.name}
                    </Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              )}
            />
          )}
      </Container>
    );
  };
}
