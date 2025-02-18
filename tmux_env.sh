#!/bin/bash

SESSION="home_site"
SESSIONEXISTS=$(tmux list-sessions | grep $SESSION)

# Only create tmux session if it doesn't already exist
if [ "$SESSIONEXISTS" = "" ]
then
  tmux new-session -d -s $SESSION
  
  # Setup run environment
  tmux rename-window -t 0 'run'
  tmux send-keys -t 'run' 'cd node_app && sudo node app.js' C-m
  tmux split-window -h
  tmux send-keys -t 'run' 'cd snake_control && source venv/bin/activate' C-m

  # Setup coding environment
  tmux new-window -t $SESSION:1 -n 'code'
  tmux send-keys -t 'code' 'cd node_app' C-m
  tmux send-keys -t 'code' 'nvim app.js' C-m
  tmux split-window -h
  tmux send-keys -t 'code' 'cd snake_control && source venv/bin/activate' C-m
  tmux send-keys -t 'code' 'nvim socket_test.py' C-m

  # Setup git/general environment
  tmux new-window -t $SESSION:2 -n 'home_dir'
  tmux send-keys -t 'home_dir' 'git status' C-m
fi 

# Attach Session, on the run window
tmux attach-session -t $SESSION:0
