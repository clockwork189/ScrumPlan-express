
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('homepage/index.ejs', { title: 'ScrumPlan', layout: 'homepage/layout' });
};

exports.login = function(req, res){
    res.render('login/index.ejs', { title: 'ScrumPlan: Login', layout: 'login/layout' });
};

exports.user_manage = function(req, res){
    res.render('user/manage/index.ejs', { title: 'ScrumPlan: User Dashboard', layout: 'user/layout/layout' });
};