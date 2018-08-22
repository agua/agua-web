use MooseX::Declare;

=head2

	PACKAGE		Web::Package
	
	PURPOSE
	
		USE THE Package::Main OBJECT TO:
					
			1. SYNC WORKFLOWS FROM REMOTE REPO
			
				- DOWNLOAD FROM REMOTE REPO

				- LOAD PROJECT & WORKFLOW FILES INTO DATABASE

			2. SYNC WORKFLOWS TO REMOTE REPO
				
				- CREATE PROJECT & WORKFLOW FILES FROM DATABASE
			
				- UPLOAD TO REMOTE REPO

=cut

use strict;
use warnings;
use Carp;

class Web::Package with (Package::Main,
	Table::Main,
	Web::Group::Privileges,
	Table::Project,
	Table::Workflow,
	Table::Stage,
	Util::Main) extends Ops::Main {


#### EXTERNAL MODULES
use Data::Dumper;
use FindBin::Real;
use lib FindBin::Real::Bin() . "/lib";

#### INTERNAL MODULES	
use DBase::Factory;
use Conf::Yaml;
use Ops::Main;
use Engine::Instance;

#### CONSTANTS
has 'application'	=> ( isa => 'Str', is => 'rw' );

# Ints
has 'log'		=>  ( isa => 'Int', is => 'rw', default => 2 );  
has 'printlog'		=>  ( isa => 'Int', is => 'rw', default => 5 );
has 'validated'		=> ( isa => 'Int', is => 'rw', default => 0 );

# Strings
has 'logfile'       => ( isa => 'Str|Undef', is => 'rw' );
has 'owner'	        => ( isa => 'Str|Undef', is => 'rw' );
has 'package'		=> ( isa => 'Str|Undef', is => 'rw' );
has 'remoterepo'	=> ( isa => 'Str|Undef', is => 'rw' );
has 'sourcedir'		=> ( isa => 'Str|Undef', is => 'rw' );
has 'installdir'	=> ( isa => 'Str|Undef', is => 'rw' );
has 'dumpfile'		=> ( isa => 'Str|Undef', is => 'rw' );
has 'database'		=> ( isa => 'Str|Undef', is => 'rw' );
has 'rootpassword'  => ( isa => 'Str|Undef', is => 'rw' );
has 'dbuser'        => ( isa => 'Str|Undef', is => 'rw' );
has 'dbpass'        => ( isa => 'Str|Undef', is => 'rw' );
has 'sessionid'     => ( isa => 'Str|Undef', is => 'rw' );

# Objects
has 'json'			=> ( isa => 'HashRef', is => 'rw', required => 0 );
has 'head' 	=> (
	is =>	'rw',
	'isa' => 'Engine::Instance',
	default	=>	sub { Engine::Instance->new();	}
);
has 'master' 	=> (
	is =>	'rw',
	'isa' => 'Engine::Instance',
	default	=>	sub { Engine::Instance->new();	}
);

has 'ops' 	=> (
	is 		=>	'rw',
	isa 	=>	'Ops::Main',
	default	=>	sub { Ops::Main->new();	}
);

has 'conf' 	=> (
	is =>	'rw',
	isa => 'Conf::Yaml',
	default	=>	sub { Conf::Yaml->new(	memory	=>	1	);	}
);
has 'db'	=> (
	isa => 'Any',
	is => 'rw',
	required => 0
);

method BUILD ($hash) {
}

method initialise ($args) {
	$self->setSlots($args);
	#$self->logDebug("args", $args);

	#### SET LOG
	my $username 	=	$self->username() || $args->{username} || "agua";
	my $logfile 	= 	$self->logfile();
	#$self->logDebug("logfile", $logfile);
	my $mode		=	$self->mode() || $args->{mode} || "package";
	#$self->logDebug("mode", $mode);
	if ( not defined $logfile or not $logfile and defined $mode) {
		my $identifier 	= 	"package";
		$self->setUserLogfile($username, $identifier, $mode);
		$self->appendLog($logfile);
	}
	
	#### SET DATABASE HANDLE
	#$self->logDebug("Doing self->setDbh()");
	$self->setDbh() if not defined $self->db();
    
#	#### VALIDATE
#    $self->logError("User session not validated for username: $username") and exit unless $self->validate();

}

method getWhoami {
	my $whoami	=	`whoami`;
	$whoami	=~	s/\s+$//;
	
	return $whoami;
}

method setUserLogfile ($username, $identifier, $mode) {
	my $installdir = $self->conf()->getKey($self->application(), "INSTALLDIR");
	
	return "$installdir/log/$username.$identifier.$mode.log";
}


}

1;

