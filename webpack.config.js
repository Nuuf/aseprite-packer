module.exports = function ( env ) {

  if ( env === 'development' ) {

    return require( './conf/development.config' )();
  
  }

  if ( env === 'production' ) {

    return require( './conf/production.config' )();
  
  }

};
