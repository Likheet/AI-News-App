import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import wordsToNumbers from 'words-to-numbers';
import alanBtn from '@alan-ai/alan-sdk-web';

import logo from './images/logo.png';
import { NewsCards} from './components';
import useStyles from './styles';
let alanInstance = null;
const App = () => {
  const [activeArticle, setActiveArticle] = useState(0);
  const [newsArticles, setNewsArticles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    if (!alanInstance) {
      alanInstance = alanBtn({
        key: 'cc0858c3bdde4c82a467f18d4560b1c32e956eca572e1d8b807a3e2338fdd0dc/stage',
        onCommand: ({ command, articles, number }) => {
          if (command === 'newHeadlines') {
            setNewsArticles(articles);
            setActiveArticle(-1);
          } else if (command === 'instructions') {
            setIsOpen(true);
          } else if (command === 'highlight') {
            setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
          } else if (command === 'open') {
            const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
            const article = articles[parsedNumber - 1];

            if (parsedNumber > articles.length) {
              alanInstance.playText('Please try that again...');
            } else if (article) {
              window.open(article.url, '_blank');
              alanInstance.playText('Opening...');
            } else {
              alanInstance.playText('Please try that again...');
            }
          }
        },
      });
    }
  }, []);

  return (
    <div>
      <div className={classes.logoContainer}>
        {newsArticles.length ? (
          <div className={classes.infoContainer}>
            <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Open article number [4]</Typography></div>
            <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Go back</Typography></div>
          </div>
        ) : null}
        <img src="https://scontent.fblr1-6.fna.fbcdn.net/v/t39.30808-6/305583606_437935075025160_1456736852241478785_n.jpg?stp=dst-jpg_p600x600&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=lK5Qv-AfFIoAX_ybmsU&_nc_ht=scontent.fblr1-6.fna&oh=00_AfAg-Llue1nQskBvnD99PR1nxXQMBgraJGFmGhkp2bXtaw&oe=655E3952" className={classes.alanLogo} alt="logo" />
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
      {!newsArticles.length ? (
        <div className={classes.footer}>
          <Typography variant="body1" component="h2">
            Created by
            <a className={classes.link} href="https://www.linkedin.com/in/likheet"> Likheet Shetty</a> -
          </Typography>
        </div>
      ) : null}
    </div>
  );
};

export default App;