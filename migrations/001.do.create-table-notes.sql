alter table notes
	add column
		folder integer references folders(id) not null;
