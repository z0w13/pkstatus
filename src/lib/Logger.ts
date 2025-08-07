import { z } from 'zod';
import { LatestVersion, migrate } from 'src/models/migrations/log';

const LogEntry = z.object({
  message: z.string(),
  error: z.nullable(z.string()),
  stack: z.nullable(z.string()),
  time: z.number(),
});
type LogEntry = z.infer<typeof LogEntry>;
export { LogEntry };

const SerializedState = z.object({
  lines: z.array(LogEntry),
  version: z.number(),
});
type SerializedState = z.infer<typeof LogEntry>;

export class Logger {
  public lines: Array<LogEntry>;
  protected limit: number;

  constructor(lines: Array<LogEntry> = [], limit = 50) {
    this.lines = lines;
    this.limit = limit;
  }

  public log(message: string, error: string | null, stack: string | null) {
    // TODO: Log trimming without shift
    while (this.lines.length > 50) {
      this.lines.shift();
    }

    this.lines.push({
      message,
      error,
      stack,
      time: new Date().valueOf(),
    });
  }

  public clear() {
    this.lines = [];
    this.persist();
  }

  public serialize() {
    return JSON.stringify(
      SerializedState.parse({
        version: LatestVersion,
        lines: this.lines,
      }),
    );
  }

  public persist() {
    try {
      localStorage.setItem('log', this.serialize());
    } catch (e) {
      console.error('Logger::persist | error', e);
    }
  }

  static restore(): Logger {
    const logJson = localStorage.getItem('log');
    if (!logJson) {
      console.debug('no log data found in local storage');
      return new Logger();
    }

    try {
      const logDeserialized = JSON.parse(logJson);
      try {
        const logParsed = SerializedState.parse(migrate(logDeserialized));
        return new Logger(logParsed.lines);
      } catch (e) {
        console.debug('Logger::restore | SerializedState.parse error', e);
        return new Logger();
      }
    } catch (e) {
      console.debug('Logger::restore | JSON.parse error', e);
      return new Logger();
    }
  }
}
