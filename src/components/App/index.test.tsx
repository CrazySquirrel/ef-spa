import * as React from 'react';

import {shallow, mount} from 'enzyme';

import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';

import {StoreTree, DefaultStore} from '../../store';

import {
  MetadataImage,
  MetadataVideo,
  MetadataAudio,
  MetadataType,
} from '../../types';

import {mapStateToProps, mapDispatchToProps, App} from './index';

import configureStore from 'redux-mock-store';

const mockStore = configureStore();

const data = 'Sat Jan 12 2019 02:56:35 GMT+0300 (Moscow Standard Time)';

describe('App', () => {
  const defaultProps = {
    title: 'test',
    description: 'test',
    keywords: 'test',
    location: '/',
    modified: data,
  };

  it('render default', () => {
    expect(shallow(<App {...defaultProps} />)).toMatchSnapshot();
  });

  it('render article', () => {
    expect(shallow(<App {...defaultProps} type={MetadataType.ARTICLE}/>)).toMatchSnapshot();
  });

  it('render with update', () => {
    const additionalProps = {
      update: (location: string) => location,
    };

    expect(shallow(<App {...defaultProps} {...additionalProps}/>)).toMatchSnapshot();
  });

  it('render with audios', () => {
    const audios: MetadataAudio[] = [{
      src: 'test',
      type: 'test',
    }];

    expect(shallow(<App {...defaultProps} audios={audios}/>)).toMatchSnapshot();
  });

  it('render with videos', () => {
    const videos: MetadataVideo[] = [{
      src: 'test',
      type: 'test',
      width: 'test',
      height: 'test',
    }];

    expect(shallow(<App {...defaultProps} videos={videos}/>)).toMatchSnapshot();
  });

  it('render with images', () => {
    const images: MetadataImage[] = [{
      src: 'test',
      type: 'test',
      width: 'test',
      height: 'test',
      alt: 'test',
      sizes: 'test',
    }];

    expect(shallow(<App {...defaultProps} images={images}/>)).toMatchSnapshot();
  });

  it('render deep', () => {
    const store = mockStore(DefaultStore);

    const spy = jest.spyOn(App.prototype, 'componentDidMount');

    const component = mount(<Provider store={store}><BrowserRouter><App {...defaultProps} /></BrowserRouter></Provider>);

    expect(spy).toHaveBeenCalled();

    component.unmount();
  });

  it('map state to props', () => {
    const initialState = {
      location: '/',
      modified: data,
    } as StoreTree;

    const mapProps = mapStateToProps(initialState);

    expect(mapProps.location).toEqual(initialState.location);
    expect(mapProps.modified).toEqual(initialState.modified);
  });

  it('map dispatch to props', () => {
    const dispatch = jest.fn();

    mapDispatchToProps(dispatch).update('/');

    expect(dispatch.mock.calls[0][0]).toEqual({type: 'ROUTE_UPDATE', payload: '/'});
  });
});
