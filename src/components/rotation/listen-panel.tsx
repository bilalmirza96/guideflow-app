import { Panel } from '@/components/shared/panel';
import { PanelHeader } from '@/components/shared/panel-header';

interface PodcastEpisode {
  title: string;
  duration: string;
  date: string;
}

const EPISODES: PodcastEpisode[] = [
  { title: 'Lap Cholecystectomy Tips', duration: '32 min', date: 'Mar 12' },
  { title: 'Trauma Resuscitation', duration: '45 min', date: 'Mar 8' },
  { title: 'Surgical Decision Making', duration: '28 min', date: 'Mar 3' },
];

export function ListenPanel() {
  return (
    <Panel>
      <PanelHeader title="Listen" />
      <div className="px-[22px] py-3 mb-2">
        <a
          href="https://behindtheknife.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors opacity-60 hover:opacity-80"
        >
          <span className="font-serif text-[15px] font-semibold tracking-tight">
            Behind the Knife
          </span>
        </a>
      </div>
      <div className="divide-y divide-[var(--gf-border)]">
        {EPISODES.map((episode, index) => (
          <div
            key={index}
            className="px-[22px] py-3 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
          >
            <div className="text-[13px] font-medium text-[var(--text-1)] mb-1">
              {episode.title}
            </div>
            <div className="text-[12px] text-[var(--text-3)]">
              {episode.duration} • {episode.date}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
