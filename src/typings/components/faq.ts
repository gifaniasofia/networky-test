export type FaqProps = {
	data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type HeroProps = FaqProps & {
	selectedTab: string;
	setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
};

export type ContentProps = FaqProps & {
	selectedTab: string;
};

export type TabItem = {
	name: string;
	image?: string;
};

export type FaqItem = {
	question: string;
	answer: string;
	images?: string[];
};

export type FaqList = TabItem & FaqItem;

export type TabsProps = {
	tabs: TabItem[];
	selectedTab: string;
	setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
};