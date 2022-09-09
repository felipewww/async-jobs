import moduleAlias from 'module-alias';
moduleAlias.addAliases({
    '@Presentation': __dirname + '/../../Presentation',
    '@Domain': __dirname + '/../../Domain',
    '@Data': __dirname + '/../../Data',
    '@Main': __dirname + '/../../Main',
    '@Infra': __dirname + '/../../Infra',
    '@Services': __dirname + '/../../Services',
});
