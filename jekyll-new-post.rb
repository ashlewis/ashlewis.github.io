require 'date'
require 'time'

TARGET_DIR = "app/_posts/"
FILE_EXT = '.markdown'
 
article_title = ARGV[0]
categories = ARGV[1]
slug = article_title.downcase.strip.gsub(' ', '-')
 
current_date = Date.today.to_s
current_time = Time.now

filename = current_date + '-' + slug + FILE_EXT
 
File.open(TARGET_DIR + filename, "w") do |post|
 post.write("---\n")
 post.write("layout: post\n")
 post.write("title: #{article_title}\n")
 post.write("date: #{current_time}\n")
 post.write("categories: #{categories}\n")
 post.write("---")
end
 
puts 'Created new file here: '+ TARGET_DIR + filename