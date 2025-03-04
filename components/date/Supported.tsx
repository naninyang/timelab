import { SupportedHeadline, SupportedImage } from '../Svgs';
import Anchor from '../Anchor';
import styles from '@/styles/Home.module.sass';

export default function Supported() {
  return (
    <section className={styles.section}>
      <h2>
        <SupportedHeadline />
      </h2>
      <div className={styles.gffd}>
        <SupportedImage />
        <Anchor href="https://www.youtube.com/@GodFFreeDom_sadman">
          <span>채널 이동</span>
        </Anchor>
      </div>
    </section>
  );
}
