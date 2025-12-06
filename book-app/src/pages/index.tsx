import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Physical AI & Humanoid Robotics Textbook
        </Heading>
        <p className="hero__subtitle">Building the Future of Robotics with Physical AI</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/module-1/intro">
            Start Reading
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Autonomous Humanoid: Capstone Project`}
      description="A comprehensive guide to building an autonomous humanoid robot with Physical AI.">
      <HomepageHeader />
      <main>
        {/* Potentially add custom content here later */}
      </main>
    </Layout>
  );
}
