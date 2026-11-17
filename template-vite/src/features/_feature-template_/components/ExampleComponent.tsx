import { useExample } from '../hooks';
import styles from './ExampleComponent.module.css';

export const ExampleComponent = () => {
  const examples = useExample();

  return (
    <div className={styles.container}>
      <h2>Examples</h2>
      {examples.isPending && <p>Loading examples…</p>}
      {examples.isError && (
        <div className={styles.error} role="alert">
          <p>{examples.error.message}</p>
          <button type="button" onClick={() => examples.refetch()}>
            Try again
          </button>
        </div>
      )}
      {examples.isSuccess && (
        <ul className={styles.list}>
          {examples.data.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
