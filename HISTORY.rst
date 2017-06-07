=======
History
=======

Tools
-----
- This project was bootstrapped with Create React App
- CI servers
 - Travis
 - Coveralls
- Desktop application
 - Electron
 - Unix Socket
 - Notifications
- JavaScript library
 - ReactJs
 - Redux
 - React-Router V4
- Tests
 - JEST
 - Enzyme
 - Sinon

Done
----
- Parsec-GUI
 - Coverage [51%]
 - PersonalFiles
  - Connect to unix socket
  - Redirection -> NoSocket Page
  - Breadcrumb
  - List files
  - Add file
  - Create directory
  - Rename file
  - Rename directory
  - Remove file
  - Remove directory
  - Download file
 - DeletedFiles
  - Connect to unix socket
  - Redirection -> NoSocket Page
  - List deleted files
  - Restore file
 - History
  - Connect to unix socket
  - Redirection -> NoSocket Page
 - Error pages
  - NoSocket
  - NotFound
 - Routes
  - */* -> PersonalFiles
  - */personal-files* -> PersonalFiles
  - */deleted-files* -> DeletedFiles
  - */history* -> History
  - */socket-error* -> NoSocket
  - */404* -> NotFound
 - Modals
  - Create directory
  - Rename file
  - Rename directory
  - Remove file
  - Remove directory
  - Restore file
 - ViewSwitcher
  - List view
  - Grid view
 - Unix Socket
  - SOCKET_CONNECT
  - SOCKET_END
  - IDENTITY_LOAD
  - USER_MANIFEST_LOAD
  - USER_MANIFEST_CREATE_FILE
  - USER_MANIFEST_RENAME_FILE
  - USER_MANIFEST_DELETE_FILE
  - USER_MANIFEST_LIST_DIR
  - USER_MANIFEST_MAKE_DIR
  - USER_MANIFEST_REMOVE_DIR
  - USER_MANIFEST_SHOW_DUSTBIN
  - USER_MANIFEST_RESTORE
  - FILE_READ
  - FILE_STAT
 - Notifications
  - Add file
  - Create directory
  - Rename file
  - Rename directory
  - Remove file
  - Remove directory
  - Restore file
 - API
  - Notify api
  - Socket api

Todo
----

09/06/2017
**********************
- Parsec-GUI
 - History
  - Show history
  - Restore history
 - Modals
  - Restore history
 - Unix Socket
  - USER_MANIFEST_HISTORY
  - USER_MANIFEST_RESTORE
 - Notifications
  - Restore history
 - API
  - Socket api

02/06/2017
**********************
- Parsec-GUI
 - History
  - Connect to unix socket
  - Redirection -> NoSocket Page
  - Show history                                                [~OK]
  - Restore history                                             [KO]
 - Routes
  - */history* -> History
 - Modals
  - Restore history                                             [KO]
 - Unix Socket
  - USER_MANIFEST_HISTORY                                       [~OK]
  - USER_MANIFEST_RESTORE                                       [~OK]
 - Notifications
  - Restore history                                             [KO]
 - API
  - Remove custom middlewares + use thunk with custom API
  - Notify api
  - Socket api                                                  [~OK]

26/05/2017
**********************
- Parsec-GUI
 - PersonalFiles
  - Download File
 - DeletedFiles
  - Connect to unix socket
  - Redirection -> NoSocket Page
  - List deleted files
  - Restore file
 - Routes
  - */deleted-files* -> DeletedFiles
 - Modals
  - Restore file
 - Unix Socket
  - USER_MANIFEST_SHOW_DUSTBIN
  - USER_MANIFEST_RESTORE
  - FILE_READ
 - Notifications
  - Restore file

19/05/2017
**********************
- Parsec-GUI
 - PersonalFiles
  - Connect to unix socket
  - Redirection -> NoSocket Page
  - Breadcrumb
  - List files
  - Add file
  - Create directory
  - Rename file
  - Rename directory
  - Remove file
  - Remove directory
 - Error pages
  - NoSocket
  - NotFound
 - Routes
  - */* -> PersonalFiles
  - */personal-files* -> PersonalFiles
  - */socket-error* -> NoSocket
  - */404* -> NotFound
 - Modals
  - Create directory
  - Rename file
  - Rename directory
  - Remove file
  - Remove directory
 - ViewSwitcher
  - List view
  - Grid view
 - Unix Socket
  - SOCKET_CONNECT
  - SOCKET_END
  - IDENTITY_LOAD
  - USER_MANIFEST_LOAD
  - USER_MANIFEST_CREATE_FILE
  - USER_MANIFEST_RENAME_FILE
  - USER_MANIFEST_DELETE_FILE
  - USER_MANIFEST_LIST_DIR
  - USER_MANIFEST_MAKE_DIR
  - USER_MANIFEST_REMOVE_DIR
  - FILE_STAT
 - Notifications
  - Add file
  - Create directory
  - Rename file
  - Rename directory
  - Remove file
  - Remove directory
