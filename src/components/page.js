import React from 'react';
import classNames from 'classnames';

import HeaderComponent from './header';
import FooterComponent from './footer';

export default class Page extends React.Component {

  render() {
    let {kataGroups} = this.props;
    const katasCount = kataGroups.all().reduce((old, {katas: {length}}) => old + length, 0);
    const {showWorkshopBanner} = this.props;
    return (
      <div>
        <HeaderComponent />
        <KataGroups groups={kataGroups}/>
        <FooterComponent katasCount={katasCount} />
        <WorkshopBanner showWorkshopBanner={showWorkshopBanner}/>
      </div>
    );
  }
}

class KataGroups extends React.Component {
  render() {
    const {groups:kataGroups} = this.props;
    return (
      <div>
        {kataGroups.all().map(group => <KataGroup group={group} isNewestKataCheck={kataGroups.isNewestKata.bind(kataGroups)}
                                          key={group.name}/>)}
      </div>
    );
  }
}

class KataGroup extends React.Component {
  render() {
    const group = this.props.group;
    const {isNewestKataCheck} = this.props;
    return (
      <div className="group">
        <h2>{group.name}</h2>
        {group.katas.map((kata) => <Kata kata={kata} isNewest={isNewestKataCheck(kata)} key={kata.id}/>)}
      </div>
    );
  }
}

class Kata extends React.Component {
  render() {
    const {kata, isNewest} = this.props;
    const {url, name, level} = kata;
    const marker =
      isNewest ? <span className="notification-bubble new">new</span> :
        (level === 'BEGINNER' ? <span className="notification-bubble easy">easy</span> : '');
    return <div className="kata">
      {marker}<a href={url} target="_blank"><KataName name={name} /></a>
      <KataDetails kata={kata} />
    </div>;
  }
}

class KataName extends React.Component {
  render() {
    const classNames = [];
    
    function renderWithName(name) {
      return <span className={classNames}>
        {name}
      </span>
    }
    
    const {name} = this.props;
    if (name.startsWith('`') && name.endsWith('`')) {
      classNames.push('code');
      const sourceCode = name.substr(1, name.length-2);
      return renderWithName(sourceCode);
    }
    return renderWithName(name);
  }
}

class KataDetails extends React.Component {
  render() {
    const {kata} = this.props;
    return (
      <span className="details">
        <h2>{kata.name} (#{kata.id})</h2>
        <p>{kata.description}</p>
        Difficulty: {kata.level.toLowerCase()}<br/>
        <KataLinks links={kata.links} />
      </span>
    );
  }
}

class KataLinks extends React.Component {
  render() {
    const {links=[]} = this.props;
    if (links.length === 0) {
      return null;
    }
    return (
      <section>
        <h3>Links for futher reading</h3>
        <ul>
          {links.map(link => <li><a href={link.url}>{link.comment}</a></li>)}
        </ul>
      </section>
    );
  }
}

class WorkshopBanner extends React.Component {
  constructor() {
    super();
    this.state = {bannerIsMinimized: false};
  }

  render() {
    const imageUrl = './workshopbanner.png';
    const workshopUrl = 'http://www.uxebu.com/all-workshops/es6-and-react-js/';
    var classes = classNames({
      'workshop-banner': true,
      'fade-in': this.props.showWorkshopBanner,
      'small': this.state.bannerIsMinimized
    });
    return <div className={classes}>
      <div className="close-button-container">
        <button className="close" onClick={this.minimizeBanner.bind(this)}>[x]</button>
      </div>
      <a href={workshopUrl} target="_blank" onMouseOver={this.maximizeBanner.bind(this)}>
        <img src={imageUrl} alt="ES6+reactjs workshop" width="125" height="195"/>
      </a>
    </div>
  }

  minimizeBanner() {
    this.setState({bannerIsMinimized: true});
  }

  maximizeBanner() {
    this.setState({bannerIsMinimized: false});
  }
}
