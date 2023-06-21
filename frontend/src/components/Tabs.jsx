'use client';

import { Tabs } from 'flowbite-react';
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';

export default function Tab(props) {
	
	return (
		<Tabs.Group
			aria-label="Default tabs"
			style="default"
		>

			{
				props.items.map(item => {
					return (
						<Tabs.Item {...item.attributes} key={crypto.randomUUID()} icon={item.icon} title={item.title}>
							{item.children}
						</Tabs.Item>
					)
				})
			}


		</Tabs.Group>
	)
}


